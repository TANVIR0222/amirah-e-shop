import { ProductGrid } from "@/components/ui/product-grid"
import { Screen } from "@/components/ui/screen"
import { SectionHeader } from "@/components/ui/section-header"
import { useGetProductsQuery } from "@/features/shop/api/shop-api"
import { resolveProductImage } from "@/hooks/use-product-actions"
import { useFavorites } from "@/lib/storage/favorite-storage"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import { router, useNavigation } from "expo-router"
import { DrawerActions } from "expo-router/react-navigation"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useDebounce } from "use-debounce"
import { useGetNewProductsQuery } from "../api/home-api"
import HomeCarousel from "../components/home-carousel"
import HomeCategories from "../components/home-categories"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()
  const { favorites } = useFavorites()

  const { data, isLoading } = useGetNewProductsQuery()
  const allProducts = data?.data || []

  const [search, setSearch] = useState<string>("")
  const [debouncedSearch] = useDebounce(search, 300)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useGetProductsQuery(
    { search: debouncedSearch, per_page: 10 },
    { skip: !debouncedSearch.trim() }
  )

  const searchProducts = searchData?.data?.data || []
  const showDropdown = isFocused && search.trim().length > 0

  const handleSelectProduct = (productId: number) => {
    setSearch("")
    setIsFocused(false)
    Keyboard.dismiss()
    router.push({
      pathname: "/product/[id]",
      params: { id: String(productId) },
    })
  }

  const handleSubmitSearch = () => {
    if (!search.trim()) return
    const query = search.trim()
    setSearch("")
    setIsFocused(false)
    Keyboard.dismiss()
    router.push({
      pathname: "/(drawer)/(tabs)/shop",
      params: { search: query },
    })
  }

  return (
    <View style={tw`flex-col flex-1 gap-0 relative`}>
      {/* ── Backdrop Overlay for Search Dropdown ── */}
      {showDropdown && (
        <TouchableWithoutFeedback
          onPress={() => {
            setIsFocused(false)
            Keyboard.dismiss()
          }}
        >
          <View style={tw`absolute inset-0 z-30 bg-black/25`} />
        </TouchableWithoutFeedback>
      )}

      {/* ── Top Header Bar ── */}
      <View
        style={tw.style(`flex-row items-center px-3 pt-2 pb-2.5 z-40`, {
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
            onChangeText={(text) => {
              setSearch(text)
              if (!isFocused) setIsFocused(true)
            }}
            onFocus={() => setIsFocused(true)}
            onSubmitEditing={handleSubmitSearch}
            placeholderTextColor="#999"
            returnKeyType="search"
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => {
              setSearch("")
              setIsFocused(false)
            }}
            hitSlop={6}
          >
            <Ionicons name="close-circle" size={16} color="#999" />
          </TouchableOpacity>
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

      {/* ── Search Suggestions Dropdown Overlay ── */}
      {showDropdown && (
        <View
          style={tw.style(
            `absolute left-3 right-3 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-gray-100`,
            {
              top: top + 62,
              maxHeight: 380,
            }
          )}
        >
          {isSearchLoading || isSearchFetching ? (
            <View style={tw`p-4 flex-row items-center justify-center gap-2`}>
              <ActivityIndicator size="small" color={colors.danger} />
              <Text style={tw`text-sm text-gray-500`}>
                Searching products...
              </Text>
            </View>
          ) : searchProducts.length > 0 ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              style={tw`max-h-[380px]`}
            >
              {searchProducts.map((item: any, index: number) => {
                const imageUri = resolveProductImage(item)
                const name = item.name || item.product_name || "Product"
                const price = item.price ?? item.cost ?? 0

                return (
                  <TouchableOpacity
                    key={item.id ?? index}
                    activeOpacity={0.7}
                    onPress={() => handleSelectProduct(item.id)}
                    style={tw.style(
                      `flex-row items-center justify-between px-3.5 py-2.5 border-b border-gray-100`,
                      index === searchProducts.length - 1 ? `border-b-0` : ``
                    )}
                  >
                    <View style={tw`flex-row items-center flex-1 mr-2 gap-3`}>
                      <Image
                        source={{ uri: imageUri }}
                        style={tw`w-10 h-10 rounded-lg bg-gray-100`}
                        contentFit="cover"
                      />
                      <View style={tw`flex-1`}>
                        <Text
                          numberOfLines={1}
                          style={tw`text-sm font-semibold text-gray-800`}
                        >
                          {name}
                        </Text>
                        {item.category?.name ? (
                          <Text
                            numberOfLines={1}
                            style={tw`text-[11px] text-gray-400 mt-0.5`}
                          >
                            {item.category.name}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={tw`flex-row items-center gap-2`}>
                      <Text style={tw`text-xs font-bold text-[#08A44A]`}>
                        ৳{price}
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={16}
                        color="#9CA3AF"
                      />
                    </View>
                  </TouchableOpacity>
                )
              })}

              <TouchableOpacity
                onPress={handleSubmitSearch}
                style={tw`p-3 bg-gray-50 flex-row items-center justify-center gap-1.5 border-t border-gray-100`}
              >
                <Text style={tw`text-xs font-semibold text-gray-700`}>
                  {`See all results for "${search}"`}
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#374151" />
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={tw`p-6 items-center justify-center`}>
              <Ionicons name="search-outline" size={32} color="#D1D5DB" />
              <Text
                style={tw`text-sm text-gray-500 font-medium mt-2 text-center`}
              >
                {`No products found for "${search}"`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* ── Page Content ── */}
      <Screen>
        <HomeCarousel />
        <SectionHeader
          title="Categories"
          action="View All"
          onActionPress={() => router.push("/category/all-category")}
        />
        <HomeCategories />
        <SectionHeader
          title="Featured Products"
          action="View All"
          onActionPress={() => router.push("/(drawer)/(tabs)/shop")}
        />
        <ProductGrid
          data={allProducts}
          isLoading={isLoading}
          scrollEnabled={false}
        />
      </Screen>
    </View>
  )
}
