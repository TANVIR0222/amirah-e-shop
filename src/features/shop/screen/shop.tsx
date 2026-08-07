import { AppText } from "@/components/ui/app-text"
import { ProductGrid } from "@/components/ui/product-grid"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import React, { useMemo } from "react"
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useGetProductsQuery, useLazyGetProductsQuery } from "../api/shop-api"
import { ShopProductResponse } from "../types/shop-type"

const PER_PAGE = 10
const BRAND = "#F0653A"

export default function Shop() {
  const { colors } = useAppTheme()
  const [search, setSearch] = React.useState("")
  // Extra pages fetched beyond page 1
  const [extraItems, setExtraItems] = React.useState<ShopProductResponse[]>([])
  const [nextPage, setNextPage] = React.useState(2)
  const [hasMore, setHasMore] = React.useState(true)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)

  // ── Page 1: RTK Query auto-fetches — no useEffect needed ─────────────────
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useGetProductsQuery({ page: 1, per_page: PER_PAGE })

  // ── Lazy query for pages 2+ ───────────────────────────────────────────────
  const [fetchMore] = useLazyGetProductsQuery()

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
  const allItems = React.useMemo(
    () => [...page1Items, ...extraItems],
    [page1Items, extraItems]
  )

  // ── Handlers (setState only from events — no effect-triggered setState) ───

  const handleLoadMore = React.useCallback(() => {
    if (loadingMore || !effectiveHasMore || isLoading) return
    setLoadingMore(true)

    fetchMore({ page: nextPage, per_page: PER_PAGE })
      .unwrap()
      .then((res) => {
        const pagination = res.data
        setExtraItems((prev) => [...prev, ...pagination.data])
        setHasMore(pagination.current_page < pagination.last_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch((err) => {
        if (__DEV__) console.warn("[Shop] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [loadingMore, effectiveHasMore, isLoading, fetchMore, nextPage])

  const handleRefresh = React.useCallback(() => {
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
      <View style={tw`py-6 items-center flex-1 justify-center`}>
        <ActivityIndicator color={BRAND} size="large" />
      </View>
    )
  }

  return (
    <Screen scroll={true}>
      <AppText variant="title">Shop</AppText>

      {/* Search bar + Filter icon */}
      <View style={tw`flex-row items-center gap-2 mt-4`}>
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

      <ProductGrid
        data={allItems}
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListFooterComponent={
          loadingMore ? (
            <View style={tw`px-4 justify-center`}>
              <ActivityIndicator size="small" color={BRAND} />
            </View>
          ) : null
        }
      />
    </Screen>
  )
}
