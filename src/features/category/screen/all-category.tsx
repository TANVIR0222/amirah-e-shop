import { TopHeaderBar } from "@/components/ui/top-header-bar"
import {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
} from "@/features/home/api/home-api"
import { CategoryResponse } from "@/features/home/types/home-api-type"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import React, { useCallback, useMemo, useState } from "react"
import { Dimensions, TextInput, TouchableOpacity, View } from "react-native"
import AllCategoryCard from "../components/all-category-card"
import CategoryCardSkeleton from "../components/skeleton/all-category-skeleton"

const PER_PAGE = 15
const { width: SCREEN_WIDTH } = Dimensions.get("window")
const GAP = 12
const PADDING = 16
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - PADDING * 2 - GAP) / 2)

export default function AllCategoriesScreen() {
  const { colors } = useAppTheme()

  const [search, setSearch] = useState("")
  const [extraItems, setExtraItems] = useState<CategoryResponse[]>([])
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)

  // ── Page 1: Initial auto-fetch ──────────────────────────────────────────
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useGetCategoriesQuery({ page: 1, per_page: PER_PAGE })

  // ── Lazy query for pagination ───────────────────────────────────────────
  const [fetchMore] = useLazyGetCategoriesQuery()

  // ── Derive page-1 items & meta ──────────────────────────────────────────
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

  const filteredItems = useMemo(() => {
    if (!search.trim()) return allItems
    const query = search.toLowerCase().trim()
    return allItems.filter((item) => item.name?.toLowerCase().includes(query))
  }, [allItems, search])

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleLoadMore = useCallback(() => {
    if (
      loadingMore ||
      !effectiveHasMore ||
      isLoading ||
      search.trim().length > 0
    ) {
      return
    }
    setLoadingMore(true)

    fetchMore({ page: nextPage, per_page: PER_PAGE })
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
        if (__DEV__) console.warn("[AllCategories] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [loadingMore, effectiveHasMore, isLoading, search, fetchMore, nextPage])

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

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* ── Top Header Bar ── */}
      <TopHeaderBar
        title="All Categories"
        subtitle={`${filteredItems.length} ${filteredItems.length === 1 ? "category" : "categories"} available`}
      />

      {/* ── Search Bar ── */}
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
            placeholder="Search categories..."
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

      {/* ── Categories Grid / Loader ── */}
      {isLoading && allItems.length === 0 ? (
        <CategoryCardSkeleton cardWidth={CARD_WIDTH} />
      ) : (
        <AllCategoryCard
          data={filteredItems}
          loadingMore={loadingMore}
          hasMore={effectiveHasMore}
          refreshing={refreshing}
          searchQuery={search}
          activeId={activeId}
          cardWidth={CARD_WIDTH}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          onCategoryPress={handleCategoryPress}
        />
      )}
    </View>
  )
}
