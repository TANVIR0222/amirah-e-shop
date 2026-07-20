import { TouchableOpacity, View } from "react-native"

import { AppText } from "@/components/ui/app-text"

export function SectionHeader({
  title,
  action,
  onActionPress,
}: {
  title: string
  action?: string
  onActionPress?: () => void
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <AppText variant="subtitle">{title}</AppText>

      {action ? (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.6}
          hitSlop={8}
        >
          <AppText variant="caption" tone="muted">
            {action}
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
