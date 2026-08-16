import { AppText } from "@/components/ui/app-text"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import React, { memo } from "react"
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export interface TopHeaderBarProps {
  /** Title text or custom React node */
  title: string | React.ReactNode
  /** Subtitle text (e.g. "5 items saved") or custom React node */
  subtitle?: string | React.ReactNode
  /** Whether to show the back button. Default: true */
  showBackButton?: boolean
  /** Custom back press handler. Default: router.back */
  onBackPress?: () => void
  /** Custom icon for back button. Default: 'chevron-back' */
  backIconName?: keyof typeof Ionicons.glyphMap
  /** Custom left component (overrides default back button) */
  leftComponent?: React.ReactNode
  /** Custom right component */
  rightComponent?: React.ReactNode
  /** Action button text (e.g. "Clear All") */
  actionText?: string
  /** Action button icon (e.g. "trash-outline") */
  actionIcon?: keyof typeof Ionicons.glyphMap
  /** Action button press callback */
  onActionPress?: () => void
  /** Action button variant style: 'danger' | 'primary' | 'surface'. Default: 'danger' */
  actionVariant?: "danger" | "primary" | "surface"
  /** Custom container style */
  containerStyle?: StyleProp<ViewStyle>
  /** Whether to show bottom border. Default: true */
  borderBottom?: boolean
  /** Additional top padding offset beyond safe area top. Default: 10 */
  topOffset?: number
}

export const TopHeaderBar = memo(
  ({
    title,
    subtitle,
    showBackButton = true,
    onBackPress,
    backIconName = "chevron-back",
    leftComponent,
    rightComponent,
    actionText,
    actionIcon,
    onActionPress,
    actionVariant = "danger",
    containerStyle,
    borderBottom = true,
    topOffset = 10,
  }: TopHeaderBarProps) => {
    const { top } = useSafeAreaInsets()
    const { colors } = useAppTheme()

    const handleBack = () => {
      if (onBackPress) {
        onBackPress()
      } else {
        router.back()
      }
    }

    const renderActionBtn = () => {
      if (!actionText && !actionIcon) return null

      let bgStyle = "bg-[#FEF2F2] border-red-200"
      let textCol = "#EF4444"

      if (actionVariant === "primary") {
        bgStyle = "bg-[#FFF1EC] border-[#F0653A33]"
        textCol = "#F0653A"
      } else if (actionVariant === "surface") {
        bgStyle = "bg-gray-100 border-gray-200"
        textCol = colors.text
      }

      return (
        <TouchableOpacity
          onPress={onActionPress}
          hitSlop={6}
          activeOpacity={0.75}
          style={tw.style(
            `px-3 py-1.5 rounded-full border flex-row items-center gap-1 shadow-xs`,
            bgStyle
          )}
        >
          {actionIcon && (
            <Ionicons name={actionIcon} size={14} color={textCol} />
          )}
          {actionText && (
            <Text style={tw.style(`text-xs font-bold`, { color: textCol })}>
              {actionText}
            </Text>
          )}
        </TouchableOpacity>
      )
    }

    return (
      <View
        style={[
          tw.style(`px-4 pb-3 flex-row items-center justify-between`, {
            paddingTop: top + topOffset,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderBottomWidth: borderBottom ? 1 : 0,
          }),
          containerStyle,
        ]}
      >
        <View style={tw`flex-row items-center gap-3 flex-1 pr-2`}>
          {leftComponent ? (
            leftComponent
          ) : showBackButton ? (
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              style={tw.style(
                `w-9 h-9 rounded-full items-center justify-center border shadow-xs`,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              )}
            >
              <Ionicons name={backIconName} size={20} color={colors.text} />
            </TouchableOpacity>
          ) : null}

          <View style={tw`flex-1`}>
            {typeof title === "string" ? (
              <AppText variant="title" numberOfLines={1}>
                {title}
              </AppText>
            ) : (
              title
            )}

            {subtitle != null &&
              (typeof subtitle === "string" ? (
                <Text
                  numberOfLines={1}
                  style={tw`text-[11px] font-medium text-gray-400 mt-0.5`}
                >
                  {subtitle}
                </Text>
              ) : (
                subtitle
              ))}
          </View>
        </View>

        {rightComponent ? rightComponent : renderActionBtn()}
      </View>
    )
  }
)

TopHeaderBar.displayName = "TopHeaderBar"

export default TopHeaderBar
