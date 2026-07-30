import { AppText } from "@/components/ui/app-text"
import { Screen } from "@/components/ui/screen"
import HomeItemsCard from "@/features/home/components/home-items-card"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import React from "react"
import { TextInput, TouchableOpacity, View } from "react-native"

export default function Shop() {
  const { colors } = useAppTheme()
  const [search, setSearch] = React.useState("")

  return (
    <Screen>
      <AppText variant="title">Shop</AppText>

      {/* Search bar + Filter icon */}
      <View style={tw`flex-row items-center gap-2`}>
        {/* Search input */}
        <View
          style={tw.style(
            `flex-1 flex-row items-center rounded-xl border px-3 h-11 gap-2`,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }
          )}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.mutedForeground}
          />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: colors.text, height: 44 }}
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={6}>
              <Ionicons
                name="close-circle"
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter button → opens modal */}
        <TouchableOpacity
          onPress={() => router.push("/(modal)/order-filter-modal")}
          style={tw.style(`w-11 h-11 rounded-xl items-center justify-center`, {
            backgroundColor: "#F0653A",
          })}
        >
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <HomeItemsCard />
    </Screen>
  )
}
