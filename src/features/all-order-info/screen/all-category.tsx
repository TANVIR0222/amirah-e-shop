import { AppText } from "@/components/ui/app-text"
import {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
} from "@/features/home/api/home-api"
import { CategoryResponse } from "@/features/home/types/home-api-type"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const PER_PAGE = 15
const BRAND_COLOR = "#F0653A"
const { width: SCREEN_WIDTH } = Dimensions.get("window")
const GAP = 12
const PADDING = 16
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2

// ─── CategoryCard Component ─────────────────────────────────────────────────

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

  const imageUri = item?.image
    ? item.image.startsWith("http")
      ? item.image
      : `https://amiraheshop.com/${item.image.replace(/^\//, "")}`
    : "https://amiraheshop.com/images/product/202607170221361.jpeg"

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={tw.style(`rounded-2xl overflow-hidden border mb-3 shadow-xs`, {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderColor: isActive ? BRAND_COLOR : colors.border,
      })}
    >
      <View
        style={tw.style(
          `w-full h-36 items-center justify-center overflow-hidden`,
          {
            backgroundColor: colors.background,
          }
        )}
      >
        <Image
          source={{ uri: imageUri }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      </View>

      <View style={tw`p-3 items-center justify-center`}>
        <Text
          numberOfLines={2}
          style={tw.style(`text-xs font-bold text-center leading-4`, {
            color: isActive ? BRAND_COLOR : colors.text,
          })}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

// ─── Main Screen Component ──────────────────────────────────────────────────

export default function AllCategoriesScreen() {
  const { top, bottom } = useSafeAreaInsets()
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
    )
      return
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
            <AppText variant="title">All Categories</AppText>
            <Text style={tw`text-[11px] font-medium text-gray-400`}>
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "category" : "categories"} available
            </Text>
          </View>
        </View>
      </View>

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
      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={BRAND_COLOR} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={tw.style(`px-4 pt-2`, {
            paddingBottom: Math.max(bottom + 24, 40),
          })}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: GAP,
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <CategoryCard
              item={item}
              isActive={activeId === item.id}
              onPress={() => handleCategoryPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={tw`items-center justify-center py-20 px-6`}>
              <View
                style={tw`w-20 h-20 rounded-full bg-[#FDECEA] items-center justify-center mb-4 shadow-xs`}
              >
                <Ionicons name="grid-outline" size={40} color={BRAND_COLOR} />
              </View>
              <Text
                style={tw.style(`text-lg font-bold text-center`, {
                  color: colors.text,
                })}
              >
                {search ? "No Categories Found" : "No Categories Available"}
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
                  ? `We could not find any categories matching "${search}".`
                  : "Categories will appear here once available."}
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={tw`py-4 justify-center items-center`}>
                <ActivityIndicator size="small" color={BRAND_COLOR} />
              </View>
            ) : null
          }
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
        />
      )}
    </View>
  )
}
