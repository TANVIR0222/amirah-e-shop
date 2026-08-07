import { AppText } from "@/components/ui/app-text"
import { ProductGrid } from "@/components/ui/product-grid"
import { useFavorites } from "@/lib/storage/favorite-storage"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const BRAND_COLOR = "#F0653A"

export default function MyFavouriteProductScreen() {
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()
  const { favorites, isLoading, clearFavorites } = useFavorites()
  const [search, setSearch] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }, [])

  const filteredItems = favorites.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase().trim())
  )

  console.log("Favorites: ", favorites[0]?.image)

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* ── Top Header Bar ── */}
      <View
        style={tw.style(
          `px-4 pb-3 flex-row items-center justify-between border-b`,
          {
            paddingTop: top + 10,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        )}
      >
        <View style={tw`flex-row items-center gap-3 flex-1`}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={tw.style(
              `w-9 h-9 rounded-full items-center justify-center border shadow-xs`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View>
            <AppText variant="title">My Favorites</AppText>
            <Text style={tw`text-[11px] font-medium text-gray-400`}>
              {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
              saved
            </Text>
          </View>
        </View>

        {favorites.length > 0 && (
          <TouchableOpacity
            onPress={() => clearFavorites()}
            hitSlop={6}
            style={tw`px-3 py-1.5 rounded-full bg-[#FEF2F2] border border-red-100 flex-row items-center gap-1`}
          >
            <Ionicons name="trash-outline" size={13} color="#EF4444" />
            <Text style={tw`text-xs font-bold text-[#EF4444]`}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Search Bar ── */}
      {favorites.length > 0 && (
        <View style={tw`px-4 pt-3 pb-2`}>
          <View
            style={tw.style(
              `flex-row items-center rounded-xl border px-3 h-10.5 gap-2 shadow-xs`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.mutedForeground}
            />
            <TextInput
              style={tw.style(`flex-1 text-sm h-10`, { color: colors.text })}
              placeholder="Search in favorites..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
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
        </View>
      )}

      {/* ── Loader / Favorites ProductGrid ── */}
      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={BRAND_COLOR} />
        </View>
      ) : (
        <View style={tw`flex-1 px-4`}>
          <ProductGrid
            data={filteredItems}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            contentContainerStyle={tw`pb-12`}
            ListEmptyComponent={
              <View style={tw`items-center justify-center py-20 px-6`}>
                <View
                  style={tw`w-20 h-20 rounded-full bg-[#FDECEA] items-center justify-center mb-4 shadow-xs`}
                >
                  <Ionicons
                    name="heart-dislike-outline"
                    size={40}
                    color={BRAND_COLOR}
                  />
                </View>
                <Text
                  style={tw.style(`text-lg font-bold text-center`, {
                    color: colors.text,
                  })}
                >
                  {search ? "No Matches Found" : "No Favorite Products Yet"}
                </Text>
                <Text
                  style={tw.style(
                    `text-xs mt-1 text-center max-w-[280px] leading-5`,
                    {
                      color: colors.mutedForeground,
                    }
                  )}
                >
                  {search
                    ? `We could not find any saved items matching "${search}".`
                    : "Tap the heart icon on any product to save it to your favorites list for instant shopping."}
                </Text>

                {!search && (
                  <TouchableOpacity
                    onPress={() => router.push("/(drawer)/(tabs)/shop")}
                    style={tw`mt-6 px-6 py-3.5 rounded-2xl bg-[#F0653A] flex-row items-center gap-2 shadow-sm`}
                  >
                    <Ionicons
                      name="storefront-outline"
                      size={18}
                      color="#FFF"
                    />
                    <Text style={tw`text-white font-bold text-sm`}>
                      Explore Shop
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </View>
      )}
    </View>
  )
}
