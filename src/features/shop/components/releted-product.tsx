import { ProductCard } from "@/components/ui/product-card"
import { CategoryResponse } from "@/features/home/types/home-api-type"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import { logger } from "@/utils/logger"
import { router } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import {
  useGetRelatedProductsQuery,
  useLazyGetRelatedProductsQuery,
} from "../api/shop-api"
import { ShopProductResponse } from "../types/shop-type"

const PER_PAGE = 15
const BRAND = "#F0653A"

function RelatedProduct({ id }: { id: string | number }) {
  const { colors } = useAppTheme()

  // Extra pages fetched beyond page 1
  const [extraItems, setExtraItems] = useState<ShopProductResponse[]>([])
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)

  // ── Page 1: RTK Query auto-fetches — no useEffect needed ─────────────────
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useGetRelatedProductsQuery({ page: 1, per_page: PER_PAGE, id })

  // ── Lazy query for pages 2+ ───────────────────────────────────────────────
  const [fetchMore] = useLazyGetRelatedProductsQuery()

  logger.log("RelatedProduct: page1Data", fetchMore)

  // ── Derive page-1 items & pagination meta ─────────────────────────────────
  const page1Items = useMemo(() => page1Data?.data?.data ?? [], [page1Data])
  const page1Meta = useMemo(() => page1Data?.data, [page1Data])

  // Effective hasMore: from page 1 meta initially, overridden after load-more
  const effectiveHasMore =
    extraItems.length === 0
      ? page1Meta
        ? page1Meta.current_page < page1Meta.last_page
        : false
      : hasMore

  // ── Merge all items ───────────────────────────────────────────────────────
  const allItems = useMemo(
    () => [...page1Items, ...extraItems],
    [page1Items, extraItems]
  )

  // Default active to first item (derived, not stored in effect)
  const effectiveActiveId = activeId ?? page1Items[0]?.id ?? null

  // ── Handlers (setState only from events — no effect-triggered setState) ───

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !effectiveHasMore || isLoading) return
    setLoadingMore(true)

    fetchMore({ page: nextPage, per_page: PER_PAGE, id })
      .unwrap()
      .then((res) => {
        const pagination = res.data
        setExtraItems((prev) => [...prev, ...pagination?.data])
        setHasMore(pagination.current_page < pagination.last_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch((err) => {
        if (__DEV__) console.warn("[HomeCategories] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [loadingMore, effectiveHasMore, isLoading, fetchMore, nextPage, id])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setExtraItems([])
    setNextPage(2)
    setHasMore(true)

    refetch().finally(() => {
      setRefreshing(false)
    })
  }, [refetch])

  const handleCategoryPress = useCallback((item: CategoryResponse) => {
    setActiveId(item.id)
    router.push({
      pathname: "/category",
      params: { id: String(item.id), name: item.name },
    })
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={tw`py-6 items-center`}>
        <ActivityIndicator color={BRAND} />
      </View>
    )
  }

  return (
    <View style={tw`flex-col gap-3 mt-4 pt-4 border-t border-gray-100`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw.style("text-base font-bold", { color: colors.text })}>
          Related Products
        </Text>

        <TouchableOpacity onPress={() => router.push("/(drawer)/(tabs)/shop")}>
          <Text style={tw`text-xs font-bold text-[#F0653A]`}>View All →</Text>
        </TouchableOpacity>
      </View>

      {/* Related Products Horizontal List */}
      <FlatList
        horizontal
        data={allItems}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 8,
          gap: 8,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListFooterComponent={
          loadingMore ? (
            <View style={tw`px-4 justify-center`}>
              <ActivityIndicator size="small" color={BRAND} />
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default RelatedProduct
