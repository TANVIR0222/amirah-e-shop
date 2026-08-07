import { ProductGrid } from "@/components/ui/product-grid"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router, useLocalSearchParams } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  useGetProductsQuery,
  useGetRelatedProductsQuery,
  useLazyGetProductsQuery,
  useLazyGetRelatedProductsQuery,
} from "../api/shop-api"
import { ShopProductResponse } from "../types/shop-type"

const PER_PAGE = 10
const BRAND_COLOR = "#F0653A"

export default function RelatedProductsScreen() {
  const { colors } = useAppTheme()
  const params = useLocalSearchParams<{ id?: string; title?: string }>()
  const productId = params.id
  const pageTitle = params.title || "Related Products"

  const [search, setSearch] = useState("")
  const [extraItems, setExtraItems] = useState<ShopProductResponse[]>([])
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  //
  const { top } = useSafeAreaInsets()

  // ── Query Page 1 ──
  const relatedQuery = useGetRelatedProductsQuery(
    { page: 1, per_page: PER_PAGE, id: productId },
    { skip: !productId }
  )
  const allProductsQuery = useGetProductsQuery(
    { page: 1, per_page: PER_PAGE },
    { skip: !!productId }
  )

  const activeQuery = productId ? relatedQuery : allProductsQuery
  const { data: page1Data, isLoading, refetch } = activeQuery

  // ── Query Next Pages ──
  const [fetchMoreRelated] = useLazyGetRelatedProductsQuery()
  const [fetchMoreAll] = useLazyGetProductsQuery()

  const page1Items = useMemo(() => page1Data?.data?.data ?? [], [page1Data])
  const page1Meta = useMemo(() => page1Data?.data, [page1Data])

  const effectiveHasMore =
    extraItems.length === 0
      ? page1Meta
        ? page1Meta.current_page < page1Meta.last_page
        : false
      : hasMore

  // ── Merge & Deduplicate All Items ──
  const allItems = useMemo(() => {
    const combined = [...page1Items, ...extraItems]
    const map = new Map<number | string, ShopProductResponse>()
    for (const item of combined) {
      if (item && item.id != null) {
        if (!map.has(item.id)) {
          map.set(item.id, item)
        }
      }
    }
    return Array.from(map.values())
  }, [page1Items, extraItems])

  // ── Filtered items based on search input ──
  const filteredItems = useMemo(() => {
    if (!search.trim()) return allItems
    const q = search.toLowerCase().trim()
    return allItems.filter((item) => item?.name?.toLowerCase()?.includes(q))
  }, [allItems, search])

  // ── Handlers ──
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !effectiveHasMore || isLoading) return
    setLoadingMore(true)

    const fetcher = productId
      ? fetchMoreRelated({ page: nextPage, per_page: PER_PAGE, id: productId })
      : fetchMoreAll({ page: nextPage, per_page: PER_PAGE })

    fetcher
      .unwrap()
      .then((res: any) => {
        const pagination = res.data
        if (pagination?.data && pagination.data.length > 0) {
          setExtraItems((prev) => {
            const existingIds = new Set([
              ...page1Items.map((it) => it.id),
              ...prev.map((it) => it.id),
            ])
            const newUnique = pagination.data.filter(
              (it: any) => !existingIds.has(it.id)
            )
            return [...prev, ...newUnique]
          })
          setHasMore(pagination.current_page < pagination.last_page)
          setNextPage(pagination.current_page + 1)
        } else {
          setHasMore(false)
        }
      })
      .catch((err: any) => {
        if (__DEV__)
          console.warn("[RelatedProductsScreen] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [
    loadingMore,
    effectiveHasMore,
    isLoading,
    productId,
    fetchMoreRelated,
    fetchMoreAll,
    nextPage,
    page1Items,
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

  // ── Initial Full Page Loader ──
  if (isLoading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-gray-50`}>
        <ActivityIndicator color={BRAND_COLOR} size="large" />
        <Text style={tw`text-xs font-semibold text-gray-500 mt-3`}>
          Loading products...
        </Text>
      </View>
    )
  }

  return (
    <Screen scroll={false} contentStyle={tw`{flex-1 pb-[${top}px]}`}>
      {/* ── Top Bar with Back Button & Title ── */}
      <View style={tw`flex-row items-center justify-between mt-1 mb-3`}>
        <View style={tw`flex-row items-center gap-3`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={tw.style(
              `w-10 h-10 rounded-xl items-center justify-center border shadow-xs`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View>
            <Text
              style={tw.style(`text-lg font-extrabold tracking-tight`, {
                color: colors.text,
              })}
            >
              {pageTitle}
            </Text>
            <Text style={tw`text-[11px] font-medium text-gray-400`}>
              {filteredItems.length} products available
            </Text>
          </View>
        </View>
      </View>

      {/* ── Search Input ── */}
      <View
        style={tw.style(
          `flex-row items-center rounded-xl border px-3 h-11 gap-2 mb-3`,
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
          placeholder="Search products in this list..."
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

      {/* ── Products Grid ── */}
      <View style={tw`flex-1`}>
        <ProductGrid
          data={filteredItems}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListFooterComponent={
            loadingMore ? (
              <View style={tw`py-4 items-center justify-center`}>
                <ActivityIndicator size="small" color={BRAND_COLOR} />
              </View>
            ) : !effectiveHasMore && filteredItems.length > 0 ? (
              <View style={tw`py-4 items-center justify-center`}>
                <Text style={tw`text-xs font-semibold text-gray-400`}>
                  ✓ You&apos;ve seen all {filteredItems.length} products
                </Text>
              </View>
            ) : (
              <View style={tw`h-6`} />
            )
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={tw`py-20 items-center justify-center`}>
                <View
                  style={tw.style(
                    `w-16 h-16 rounded-full items-center justify-center mb-3`,
                    { backgroundColor: "#FFF1EB" }
                  )}
                >
                  <Ionicons
                    name="basket-outline"
                    size={32}
                    color={BRAND_COLOR}
                  />
                </View>
                <Text
                  style={tw.style(`text-base font-bold`, {
                    color: colors.text,
                  })}
                >
                  No Products Found
                </Text>
                <Text
                  style={tw.style(`text-xs text-center mt-1 px-8`, {
                    color: colors.mutedForeground,
                  })}
                >
                  {search
                    ? `No matching items found for "${search}"`
                    : "No related products found at the moment."}
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </Screen>
  )
}
