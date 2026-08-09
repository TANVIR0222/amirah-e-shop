import { useGetCategoriesQuery } from "@/features/home/api/home-api"
import { CategoryResponse } from "@/features/home/types/home-api-type"
import { useProductActions } from "@/hooks/use-product-actions"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { memo, useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useDebounce } from "use-debounce"
import {
  useGetProductsQuery,
  useLazyGetProductsQuery,
} from "../api/category-api"
import CategoryCardSkeleton from "../components/skeleton/all-category-skeleton"
import { Standard } from "../type/category-type"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SIDEBAR_WIDTH = 84
const GRID_CONTAINER_WIDTH = SCREEN_WIDTH - SIDEBAR_WIDTH - 24
const CARD_WIDTH = Math.floor((GRID_CONTAINER_WIDTH - 10) / 2)
const BRAND_COLOR = "#F0653A"
const FALLBACK_IMAGE =
  "https://amiraheshop.com/images/product/202607170221361.jpeg"

const SUBCATEGORIES = ["All", "Popular", "Organic", "New In", "Offers"]

// ─── Sidebar Category Card (Same Design as all-category.tsx) ─────────────────

const SidebarCategoryCard = memo(
  ({
    item,
    isActive,
    onPress,
  }: {
    item: CategoryResponse
    isActive: boolean
    onPress: (id: number) => void
  }) => {
    const { colors } = useAppTheme()

    const handlePress = useCallback(() => {
      onPress(item.id)
    }, [item.id, onPress])

    const imageUri = item?.image
      ? item.image.startsWith("http")
        ? item.image
        : `https://amiraheshop.com/${item.image.replace(/^\//, "")}`
      : FALLBACK_IMAGE

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={tw.style(
          `w-[76px] self-center rounded-xl overflow-hidden mb-2.5 border items-center shadow-xs`,
          isActive
            ? {
                borderColor: BRAND_COLOR,
                borderWidth: 2,
                backgroundColor: colors.surface,
              }
            : {
                borderColor: colors.border,
                borderWidth: 1,
                backgroundColor: colors.surface,
              }
        )}
      >
        {/* Category Image */}
        <View
          style={tw.style(`w-full h-14 items-center justify-center relative`, {
            backgroundColor: colors.background,
          })}
        >
          <Image
            source={{ uri: imageUri }}
            style={tw`w-full h-full`}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
            placeholder={FALLBACK_IMAGE}
          />
          {isActive && (
            <View
              style={tw`absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F0653A]`}
            />
          )}
        </View>

        {/* Category Title */}
        <View style={tw`p-1.5 w-full items-center justify-center min-h-[34px]`}>
          <Text
            numberOfLines={2}
            style={tw.style(`text-[10px] font-bold text-center leading-3`, {
              color: isActive ? BRAND_COLOR : colors.text,
            })}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.isActive === next.isActive &&
    prev.item.name === next.item.name &&
    prev.item.image === next.item.image
)

SidebarCategoryCard.displayName = "SidebarCategoryCard"

// ─── Category Product Card (With useProductActions hook) ────────────────────

const CategoryProductCard = memo(({ item }: { item: Standard }) => {
  const { colors } = useAppTheme()

  const {
    qty,
    increaseQty,
    decreaseQty,
    isLiked,
    isAdded,
    imageUri,
    handleToggleHeart,
    handleQuickAdd,
  } = useProductActions(item)

  const handleCardPress = useCallback(() => {
    router.push({
      pathname: "/product/[id]",
      params: { id: String(item.id) },
    })
  }, [item.id])

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleCardPress}
      style={tw.style(`rounded-2xl overflow-hidden border mb-2.5`, {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderColor: colors.border,
      })}
    >
      {/* Product Image */}
      <View
        style={tw.style(`relative`, { backgroundColor: colors.background })}
      >
        <Image
          source={{ uri: imageUri }}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
          style={tw`w-full h-32`}
        />

        {/* Heart Favorite Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleHeart}
          style={tw.style(`absolute top-2 right-2 z-10 rounded-full p-1.5`, {
            backgroundColor: isLiked ? "#FEF2F2" : colors.surface + "CC",
          })}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={16}
            color={isLiked ? "#E53E3E" : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={tw`p-2.5`}>
        <Text
          numberOfLines={2}
          style={tw.style(`text-xs font-semibold leading-4 min-h-[32px]`, {
            color: colors.text,
          })}
        >
          {item?.name || "Product"}
        </Text>

        <Text style={tw`text-sm font-extrabold text-[#08A44A] mt-1`}>
          ৳{item?.price ?? item?.cost ?? 0}
        </Text>

        {/* Stepper + Add to Cart */}
        <View style={tw`flex-row items-center mt-2 gap-1.5`}>
          <View
            style={tw.style(
              `flex-row items-center flex-1 h-8 rounded-lg border justify-around`,
              { borderColor: colors.border }
            )}
          >
            <TouchableOpacity onPress={decreaseQty} hitSlop={4}>
              <Ionicons name="remove-outline" size={14} color={colors.text} />
            </TouchableOpacity>

            <Text style={tw.style(`text-xs font-bold`, { color: colors.text })}>
              {qty}
            </Text>

            <TouchableOpacity onPress={increaseQty} hitSlop={4}>
              <Ionicons name="add-outline" size={14} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Quick Add Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleQuickAdd}
            style={tw.style(`w-8 h-8 rounded-lg items-center justify-center`, {
              backgroundColor: isAdded ? "#16A34A" : BRAND_COLOR,
            })}
          >
            <Ionicons
              name={isAdded ? "checkmark" : "bag-handle-outline"}
              size={16}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
})

CategoryProductCard.displayName = "CategoryProductCard"

// ─── Main Category Screen ───────────────────────────────────────────────────

export default function CategoryScreen() {
  const PER_PAGE = 10
  const params = useLocalSearchParams<{ id?: string; name?: string }>()
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()

  // ── Fetch all categories for sidebar ──
  const { data: categoriesData } = useGetCategoriesQuery({
    page: 1,
    per_page: 50,
  })
  const categories = useMemo(
    () => categoriesData?.data?.data ?? [],
    [categoriesData]
  )

  const [userSelectedCatId, setUserSelectedCatId] = useState<number | null>(
    null
  )
  const [selectedSubCat, setSelectedSubCat] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [search] = useDebounce(searchQuery, 400)

  // Derived effective category ID: user click > route param > first category from API
  const selectedCatId = useMemo(() => {
    if (userSelectedCatId !== null) return userSelectedCatId
    if (params.id) return Number(params.id)
    if (categories.length > 0) return categories[0].id
    return null
  }, [userSelectedCatId, params.id, categories])

  const activeCategoryObj = useMemo(() => {
    return (
      categories.find((c) => c.id === selectedCatId) ||
      (categories.length > 0 ? categories[0] : null)
    )
  }, [categories, selectedCatId])

  // Extra pages fetched beyond page 1
  const [extraItems, setExtraItems] = useState<Standard[]>([])
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Synchronously reset extra pagination items during render when filter changes
  const [prevFilter, setPrevFilter] = useState({ id: selectedCatId, search })
  if (prevFilter.id !== selectedCatId || prevFilter.search !== search) {
    setPrevFilter({ id: selectedCatId, search })
    setExtraItems([])
    setNextPage(2)
    setHasMore(true)
  }

  // ── Page 1 Products: RTK Query ──────────────────────────────────────────
  const {
    data: page1Data,
    isLoading: isProductsLoading,
    refetch,
  } = useGetProductsQuery(
    {
      page: 1,
      per_page: PER_PAGE,
      id: selectedCatId ? String(selectedCatId) : undefined,
      search,
    },
    { skip: selectedCatId === null }
  )

  const [fetchMore] = useLazyGetProductsQuery()

  const page1Items = useMemo(() => page1Data?.data?.data ?? [], [page1Data])
  const page1Meta = useMemo(() => page1Data?.data, [page1Data])

  const effectiveHasMore =
    extraItems.length === 0
      ? page1Meta
        ? page1Meta.current_page < page1Meta.last_page
        : false
      : hasMore

  const allItems = useMemo(
    () => [...page1Items, ...extraItems],
    [page1Items, extraItems]
  )

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectCategory = useCallback((id: number) => {
    setUserSelectedCatId(id)
    setSelectedSubCat("All")
  }, [])

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !effectiveHasMore || isProductsLoading || !selectedCatId)
      return
    setLoadingMore(true)

    fetchMore({
      page: nextPage,
      per_page: PER_PAGE,
      id: String(selectedCatId),
      search,
    })
      .unwrap()
      .then((res) => {
        const pagination = res.data
        if (pagination?.data) {
          setExtraItems((prev) => [...prev, ...pagination.data])
          setHasMore(pagination.current_page < pagination.last_page)
          setNextPage(pagination.current_page + 1)
        }
      })
      .catch((err) => {
        if (__DEV__) console.warn("[CategoryProducts] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [
    loadingMore,
    effectiveHasMore,
    isProductsLoading,
    selectedCatId,
    fetchMore,
    nextPage,
    search,
  ])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setExtraItems([])
    setNextPage(2)
    setHasMore(true)

    refetch().finally(() => {
      setRefreshing(false)
    })
  }, [refetch])

  const renderProductItem = useCallback(
    ({ item }: { item: Standard }) => <CategoryProductCard item={item} />,
    []
  )

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* ── Top Header ── */}
      <View
        style={tw.style(`px-4 pb-3 flex-row items-center gap-2 border-b`, {
          paddingTop: top + 10,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        })}
      >
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

        {/* Search input */}
        <View
          style={tw.style(
            `flex-1 flex-row items-center rounded-xl px-3 h-10 gap-2 border`,
            {
              backgroundColor: colors.background,
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
            placeholder={`Search in ${activeCategoryObj?.name || "Category"}...`}
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={6}>
              <Ionicons
                name="close-circle"
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter button */}
        <TouchableOpacity
          onPress={() => router.push("/(modal)/order-filter-modal")}
          style={tw`w-10 h-10 rounded-xl items-center justify-center bg-[#F0653A]`}
        >
          <Ionicons name="options-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Main Section: Left Sidebar + Right Product Grid ── */}
      <View style={tw`flex-1 flex-row`}>
        {/* Left Category Sidebar */}
        <View
          style={tw.style(`w-[84px] border-r pt-2`, {
            backgroundColor: colors.surface,
            borderRightColor: colors.border,
          })}
        >
          <FlatList
            data={categories}
            keyExtractor={(item) => `sidebar-${item.id}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-20`}
            renderItem={({ item }) => (
              <SidebarCategoryCard
                item={item}
                isActive={selectedCatId === item.id}
                onPress={handleSelectCategory}
              />
            )}
          />
        </View>

        {/* Right Content Area */}
        <View style={tw`flex-1 px-3 pt-3`}>
          {/* Subcategory Pills Header */}
          <View style={tw`mb-3`}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`gap-2 pr-2`}
            >
              {SUBCATEGORIES.map((sub) => {
                const isActive = sub === selectedSubCat
                return (
                  <TouchableOpacity
                    key={sub}
                    activeOpacity={0.75}
                    onPress={() => setSelectedSubCat(sub)}
                    style={tw.style(`px-3.5 py-1.5 rounded-full border`, {
                      backgroundColor: isActive ? BRAND_COLOR : colors.surface,
                      borderColor: isActive ? BRAND_COLOR : colors.border,
                    })}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: isActive ? "#FFFFFF" : colors.text,
                      }}
                    >
                      {sub}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>

          {/* Banner inside category */}
          {activeCategoryObj && (
            <View
              style={tw.style(
                `rounded-2xl p-3 mb-3 flex-row items-center justify-between overflow-hidden`,
                {
                  backgroundColor: BRAND_COLOR,
                }
              )}
            >
              <View style={tw`flex-1 pr-2`}>
                <Text style={tw`text-white font-bold text-base`}>
                  {activeCategoryObj.name}
                </Text>
                <Text style={tw`text-red-100 text-xs mt-0.5`}>
                  {allItems.length > 0
                    ? `${allItems.length} Products Available`
                    : "Fresh & Quality Products"}
                </Text>
              </View>
              <View style={tw`bg-white/20 px-2.5 py-1 rounded-lg`}>
                <Text style={tw`text-white text-xs font-extrabold`}>
                  Up to 40% OFF
                </Text>
              </View>
            </View>
          )}

          {/* Product Grid / Skeleton Loader */}
          {isProductsLoading && allItems.length === 0 ? (
            <CategoryCardSkeleton
              cardWidth={CARD_WIDTH}
              columnWrapperStyle={{
                justifyContent: "space-between",
                gap: 8,
              }}
              contentContainerStyle={tw`pt-0 pb-10`}
            />
          ) : (
            <FlatList
              data={allItems}
              numColumns={2}
              keyExtractor={(item) => String(item?.id)}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: "space-between",
                gap: 8,
              }}
              contentContainerStyle={tw`pb-24`}
              renderItem={renderProductItem}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              ListEmptyComponent={
                <View style={tw`items-center justify-center py-16 px-4`}>
                  <View
                    style={tw`w-16 h-16 rounded-full bg-[#FDECEA] items-center justify-center mb-3`}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={32}
                      color={BRAND_COLOR}
                    />
                  </View>
                  <Text
                    style={tw.style(`text-base font-bold text-center`, {
                      color: colors.text,
                    })}
                  >
                    No Products Found
                  </Text>
                  <Text
                    style={tw.style(
                      `text-xs mt-1 text-center text-gray-400 leading-4 max-w-[200px]`
                    )}
                  >
                    {search
                      ? `No products matching "${search}" in this category.`
                      : "No products currently available in this category."}
                  </Text>
                </View>
              }
              ListFooterComponent={
                loadingMore ? (
                  <View style={tw`py-3 justify-center items-center`}>
                    <ActivityIndicator size="small" color={BRAND_COLOR} />
                  </View>
                ) : null
              }
              removeClippedSubviews
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={7}
            />
          )}
        </View>
      </View>
    </View>
  )
}
