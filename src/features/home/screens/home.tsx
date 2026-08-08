import { Screen } from "@/components/ui/screen"
import { SectionHeader } from "@/components/ui/section-header"
import { useFavorites } from "@/lib/storage/favorite-storage"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router, useNavigation } from "expo-router"
import { DrawerActions } from "expo-router/react-navigation"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import HomeCarousel from "../components/home-carousel"
import HomeCategories from "../components/home-categories"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()
  const { favorites } = useFavorites()

  const [search, setSearch] = React.useState<string>("")

  return (
    <View style={tw`flex-col flex-1 gap-0 `}>
      {/* <StatusBar style={"light"} /> */}

      {/* ── Top Header Bar ── */}
      <View
        style={tw.style(`flex-row items-center px-3 pt-2 pb-2.5`, {
          backgroundColor: colors.danger,
          paddingTop: top + 15,
          columnGap: 10,
        })}
      >
        {/* Drawer Toggle Button */}
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={tw.style(
            `w-10 h-10 rounded-[10px] items-center justify-center`,
            {
              backgroundColor: "rgba(255,255,255,0.2)",
            }
          )}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View
          style={tw.style(
            `flex-row flex-1 items-center bg-white rounded-[10px] px-2.5 h-10`,
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

        {/* Favorites / Wishlist */}
        <TouchableOpacity
          onPress={() => router.push("/(all-order-info)/my-favourite-product")}
          activeOpacity={0.7}
          style={tw.style(
            `w-10 h-10 rounded-[10px] items-center justify-center relative`,
            {
              backgroundColor: "rgba(255,255,255,0.2)",
            }
          )}
        >
          <Ionicons
            name={favorites.length > 0 ? "heart" : "heart-outline"}
            size={20}
            color="#fff"
          />

          {favorites.length > 0 ? (
            <View
              style={tw.style(
                `absolute -top-1 -right-1 min-w-4 h-4 rounded-full px-1 items-center justify-center`,
                {
                  backgroundColor: "#FFD700",
                }
              )}
            >
              <Text style={tw`text-[10px] font-extrabold text-gray-900`}>
                {favorites.length > 99 ? "99+" : favorites.length}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* ── Page Content ── */}
      <Screen contentStyle={tw`flex-1 -top-6 bg-gray-100`}>
        <HomeCarousel />
        <SectionHeader
          title="Categories"
          action="View All"
          onActionPress={() => router.push("/(all-order-info)/all-category")}
        />
        <HomeCategories />
        {/* <SectionHeader
          title="Featured Products"
          action="View All"
          onActionPress={() => router.push("/(drawer)/(tabs)/shop")}
        /> */}
        {/* <HomeCategories /> */}
      </Screen>
    </View>
  )
}
