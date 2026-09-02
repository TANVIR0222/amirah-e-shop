import { AppText } from "@/components/ui/app-text"
import { ProductGrid } from "@/components/ui/product-grid"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useLocalSearchParams } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useDebounce } from "use-debounce"
import { useGetProductsQuery, useLazyGetProductsQuery } from "../api/shop-api"
import { ShopProductResponse } from "../types/shop-type"

const PER_PAGE = 10
const BRAND = "#F0653A"

export default function Shop() {
  const { colors } = useAppTheme()
  const params = useLocalSearchParams<{ search?: string }>()
  const [search, setSearch] = useState(params.search || "")
  const [prevParamSearch, setPrevParamSearch] = useState(params.search)

  if (params.search !== prevParamSearch) {
    setPrevParamSearch(params.search)
    if (params.search !== undefined) {
      setSearch(params.search)
    }
  }

  const [value] = useDebounce(search, 500)

  // Extra pages fetched beyond page 1
  const [extraItems, setExtraItems] = useState<ShopProductResponse[]>([])
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Synchronously reset extra pagination items during render when search changes
  const [prevSearch, setPrevSearch] = useState(value)
  if (prevSearch !== value) {
    setPrevSearch(value)
    setExtraItems([])
    setNextPage(2)
    setHasMore(true)
  }

  // ── Page 1: RTK Query auto-fetches ────────────────────────────────────────
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useGetProductsQuery({ page: 1, per_page: PER_PAGE, search: value })

  // ── Lazy query for pages 2+ ───────────────────────────────────────────────
  const [fetchMore] = useLazyGetProductsQuery()

  // ── Derive page-1 items & pagination meta ─────────────────────────────────
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !effectiveHasMore || isLoading) return
    setLoadingMore(true)

    fetchMore({ page: nextPage, per_page: PER_PAGE, search: value })
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
        if (__DEV__) console.warn("[Shop] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [loadingMore, effectiveHasMore, isLoading, fetchMore, nextPage, value])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setExtraItems([])
    setNextPage(2)
    setHasMore(true)

    refetch().finally(() => {
      setRefreshing(false)
    })
  }, [refetch])

  // ── Header Component for ProductGrid ──────────────────────────────────────
  const ListHeader = useMemo(
    () => (
      <View style={tw`pb-2`}>
        <AppText variant="title">Shop</AppText>

        {/* Search bar + Filter icon */}
        <View style={tw`flex-row items-center gap-2 mt-4`}>
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
          {/* <TouchableOpacity
            onPress={() => router.push("/(modal)/order-filter-modal")}
            style={tw.style(
              `w-11 h-11 rounded-xl items-center justify-center`,
              {
                backgroundColor: BRAND,
              }
            )}
          >
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>
    ),
    [colors.border, colors.mutedForeground, colors.surface, colors.text, search]
  )

  return (
    <Screen scroll={false} contentStyle={{ paddingBottom: 0 }}>
      <ProductGrid
        data={allItems}
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        isLoading={isLoading && allItems.length === 0}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={tw`pb-2`}
        ListFooterComponent={
          loadingMore ? (
            <View style={tw`py-4 justify-center items-center`}>
              <ActivityIndicator size="small" color={BRAND} />
            </View>
          ) : null
        }
      />
    </Screen>
  )
}
