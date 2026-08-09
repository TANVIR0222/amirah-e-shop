import { ProductCard } from "@/components/ui/product-card"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
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

  // ── Page 1: RTK Query auto-fetches — no useEffect needed ─────────────────
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useGetRelatedProductsQuery({ page: 1, per_page: PER_PAGE, id })

  // ── Lazy query for pages 2+ ───────────────────────────────────────────────
  const [fetchMore] = useLazyGetRelatedProductsQuery()

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

  // ── Handlers ─────────────────────────────────────────────────────────────

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
        if (__DEV__) console.warn("[RelatedProduct] Load more error:", err)
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

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            router.push({
              pathname: "/product",
              params: { id: String(id), title: "Related Products" },
            })
          }
          style={tw`flex-row items-center gap-1`}
        >
          <Text style={tw`text-xs font-bold text-[#F0653A]`}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#F0653A" />
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
