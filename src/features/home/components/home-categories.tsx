import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import { router } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
} from "../api/home-api"
import { CategoryResponse } from "../types/home-api-type"

const PER_PAGE = 15
const BRAND = "#F0653A"

// ─── CategoryCard (top-level to satisfy React Hook Rules) ────────────────────

function CategoryCard({
  item,
  isActive,
  onPress,
}: {
  item: CategoryResponse
  isActive: boolean
  onPress: () => void
}) {
  const { colors } = useAppTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`items-center mr-4`}
      activeOpacity={0.7}
    >
      <View
        style={[
          tw`w-20 h-20 rounded-2xl overflow-hidden`,
          {
            borderWidth: 2,
            borderColor: isActive ? BRAND : "transparent",
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 3,
          },
        ]}
      >
        <Image
          source={{
            uri: "https://amiraheshop.com/images/product/202607170221361.jpeg",
          }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      </View>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 6,
          fontSize: 12,
          fontWeight: "600",
          color: isActive ? BRAND : colors.text,
          maxWidth: 72,
          textAlign: "center",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeCategories() {
  // Extra pages fetched beyond page 1
  const [extraItems, setExtraItems] = useState<CategoryResponse[]>([])
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
  } = useGetCategoriesQuery({ page: 1, per_page: PER_PAGE })

  // ── Lazy query for pages 2+ ───────────────────────────────────────────────
  const [fetchMore] = useLazyGetCategoriesQuery()

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

    fetchMore({ page: nextPage, per_page: PER_PAGE })
      .unwrap()
      .then((res) => {
        const pagination = res.data
        setExtraItems((prev) => [...prev, ...pagination.data])
        setHasMore(pagination.current_page < pagination.last_page)
        setNextPage(pagination.current_page + 1)
      })
      .catch((err) => {
        if (__DEV__) console.warn("[HomeCategories] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [loadingMore, effectiveHasMore, isLoading, fetchMore, nextPage])

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
    <FlatList
      horizontal
      data={allItems}
      keyExtractor={(item) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => (
        <CategoryCard
          item={item}
          isActive={effectiveActiveId === item.id}
          onPress={() => handleCategoryPress(item)}
        />
      )}
      ListFooterComponent={
        loadingMore ? (
          <View style={tw`px-4 justify-center`}>
            <ActivityIndicator size="small" color={BRAND} />
          </View>
        ) : null
      }
    />
  )
}
