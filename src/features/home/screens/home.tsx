import { Screen } from "@/components/ui/screen"
import { SectionHeader } from "@/components/ui/section-header"
import { useSession } from "@/features/auth/auth-session"
import tw from "@/lib/tailwind"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import HomeCarousel from "../components/home-carousel"
import HomeCategories from "../components/home-categories"
import HomeItemsCard from "../components/home-items-card"

const BRAND_RED = "#C52405"

export default function HomeScreen() {
  const { user } = useSession()
  const { top } = useSafeAreaInsets()

  const [search, setSearch] = React.useState<string>("")

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <View style={tw`flex-col flex-1 gap-0 `}>
      {/* <StatusBar style={"light"} /> */}

      {/* ── Top Header Bar ── */}
      <View
        style={tw.style(`flex-row items-center px-3 pt-2 pb-2.5`, {
          backgroundColor: BRAND_RED,
          paddingTop: top + 15,
          columnGap: 10,
        })}
      >
        {/* Avatar / Logo */}
        <TouchableOpacity
          onPress={() => router.push("/(drawer)/(tabs)/profile")}
          style={tw.style(
            `w-10 h-10 rounded-full items-center justify-center border-2`,
            {
              backgroundColor: "rgba(255,255,255,0.25)",
              borderColor: "rgba(255,255,255,0.6)",
            }
          )}
        >
          <Text style={tw`text-white font-bold text-[15px]`}>{initials}</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View
          style={tw.style(
            `flex-1 flex-row items-center bg-white rounded-[10px] px-2.5 h-10`,
            {
              columnGap: 6,
            }
          )}
        >
          <Ionicons name="search-outline" size={18} color="#999" />

          <TextInput
            style={tw`flex-1 text-[14px] text-black h-10`}
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
            returnKeyType="search"
            autoCapitalize="none"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={6}>
              <Ionicons name="close-circle" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Notification */}
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          style={tw.style(
            `w-10 h-10 rounded-[10px] items-center justify-center`,
            {
              backgroundColor: "rgba(255,255,255,0.2)",
            }
          )}
        >
          <Ionicons name="notifications-outline" size={20} color="#fff" />
          <View
            style={tw.style(`absolute w-2 h-2 rounded-full`, {
              top: 6,
              right: 6,
              backgroundColor: "#FF4D4D",
            })}
          />
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity
          onPress={() => router.push("/cart")}
          style={tw.style(
            `w-10 h-10 rounded-[10px] items-center justify-center`,
            {
              backgroundColor: "rgba(255,255,255,0.2)",
            }
          )}
        >
          <Ionicons name="bag-handle-outline" size={20} color="#fff" />

          <View
            style={tw.style(`absolute w-2 h-2 rounded-full`, {
              top: 6,
              right: 6,
              backgroundColor: "#FFD700",
            })}
          />
        </TouchableOpacity>
      </View>

      {/* ── Page Content ── */}
      <Screen>
        <HomeCarousel />
        <SectionHeader
          title="Categories"
          action="View All"
          onActionPress={() => router.push("/category")}
        />
        <HomeCategories />
        <SectionHeader
          title="Featured Products"
          action="View All"
          onActionPress={() => router.push("/(drawer)/(tabs)/shop")}
        />
        <HomeItemsCard />
      </Screen>
    </View>
  )
}
