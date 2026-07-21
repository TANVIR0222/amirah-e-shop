import React from "react"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { TouchableOpacity, TextInput, View } from "react-native"

interface SearchProps {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  onClear?: () => void
}

const GlobalSearch: React.FC<SearchProps> = ({
  placeholder,
  value,
  onChangeText,
  onClear,
}) => {
  const { colors } = useAppTheme()

  const handleClear = () => {
    onChangeText("")
    onClear?.()
  }

  return (
    <View
      style={tw.style(
        `w-full flex-row items-center border rounded-full px-3 gap-2`,
        {
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }
      )}
    >
      {/* Search icon — left */}
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.mutedForeground}
      />

      <TextInput
        style={[tw`flex-1 h-12`, { color: colors.text, fontSize: 15 }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.mutedForeground}
        returnKeyType="search"
        autoCapitalize="none"
      />

      {/* Clear icon — only visible when there is text */}
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={8}>
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default GlobalSearch
