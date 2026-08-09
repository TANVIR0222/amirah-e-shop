import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import React, { memo, useCallback } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CategoryResponse } from "@/features/home/types/home-api-type"
import CategoryCardSkeleton from "./skeleton/all-category-skeleton"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const GAP = 12
const PADDING = 16
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - PADDING * 2 - GAP) / 2)
const BRAND_COLOR = "#F0653A"
const FALLBACK_IMAGE =
  "https://amiraheshop.com/images/product/202607170221361.jpeg"

// ─── Single Category Card (Memoized) ─────────────────────────────────────────

export interface CategoryCardProps {
  item: CategoryResponse
  isActive?: boolean
  cardWidth?: number
  onPress: (item: CategoryResponse) => void
}

export const CategoryCard = memo(
  ({
    item,
    isActive = false,
    cardWidth = CARD_WIDTH,
    onPress,
  }: CategoryCardProps) => {
    const { colors } = useAppTheme()

    const handlePress = useCallback(() => {
      onPress(item)
    }, [item, onPress])

    // Format safe image URI
    const imageUri = item?.image
      ? item.image.startsWith("http")
        ? item.image
        : `https://amiraheshop.com/${item.image.replace(/^\//, "")}`
      : FALLBACK_IMAGE

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={tw.style(`rounded-2xl overflow-hidden border mb-3 shadow-xs`, {
          width: cardWidth,
          backgroundColor: colors.surface,
          borderColor: isActive ? BRAND_COLOR : colors.border,
          borderWidth: isActive ? 2 : 1,
        })}
      >
        {/* ── Image Container ── */}
        <View
          style={tw.style(`w-full h-34 items-center justify-center relative`, {
            backgroundColor: colors.background,
          })}
        >
          <Image
            source={{ uri: imageUri }}
            style={tw`w-full h-full`}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />

          {/* Active Badge */}
          {isActive && (
            <View
              style={tw`absolute top-2 right-2 bg-[#F0653A] px-2 py-0.5 rounded-full`}
            >
              <Text style={tw`text-[10px] font-bold text-white`}>Selected</Text>
            </View>
          )}
        </View>

        {/* ── Text Body ── */}
        <View style={tw`p-2.5 items-center justify-center min-h-[50px]`}>
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.cardWidth === nextProps.cardWidth &&
      prevProps.item.name === nextProps.item.name &&
      prevProps.item.image === nextProps.item.image
    )
  }
)

CategoryCard.displayName = "CategoryCard"

// ─── Grid List Component ────────────────────────────────────────────────────

export interface AllCategoryGridProps {
  data: CategoryResponse[]
  isLoading?: boolean
  loadingMore?: boolean
  hasMore?: boolean
  refreshing?: boolean
  searchQuery?: string
  activeId?: number | null
  cardWidth?: number
  onLoadMore?: () => void
  onRefresh?: () => void
  onCategoryPress: (item: CategoryResponse) => void
  ListHeaderComponent?: React.ReactElement | null
}

export default function AllCategoryCard({
  data = [],
  isLoading = false,
  loadingMore = false,
  refreshing = false,
  searchQuery = "",
  activeId = null,
  cardWidth = CARD_WIDTH,
  onLoadMore,
  onRefresh,
  onCategoryPress,
  ListHeaderComponent,
}: AllCategoryGridProps) {
  const { bottom } = useSafeAreaInsets()
  const { colors } = useAppTheme()

  const renderItem = useCallback(
    ({ item }: { item: CategoryResponse }) => (
      <CategoryCard
        item={item}
        isActive={activeId === item.id}
        cardWidth={cardWidth}
        onPress={onCategoryPress}
      />
    ),
    [activeId, cardWidth, onCategoryPress]
  )

  const keyExtractor = useCallback(
    (item: CategoryResponse, index: number) =>
      item?.id ? `category-${item.id}` : `category-idx-${index}`,
    []
  )

  if (isLoading && data.length === 0) {
    return <CategoryCardSkeleton cardWidth={cardWidth} />
  }

  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={tw.style(`px-4 pt-2`, {
        paddingBottom: Math.max(bottom + 24, 40),
      })}
      columnWrapperStyle={{
        justifyContent: "space-between",
        gap: GAP,
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <View style={tw`items-center justify-center py-20 px-6`}>
          <View
            style={tw`w-20 h-20 rounded-full bg-[#FDECEA] items-center justify-center mb-4 shadow-xs`}
          >
            <Ionicons name="grid-outline" size={38} color={BRAND_COLOR} />
          </View>
          <Text
            style={tw.style(`text-lg font-bold text-center`, {
              color: colors.text,
            })}
          >
            {searchQuery ? "No Categories Found" : "No Categories Available"}
          </Text>
          <Text
            style={tw.style(
              `text-xs mt-1 text-center max-w-[280px] leading-5`,
              {
                color: colors.mutedForeground,
              }
            )}
          >
            {searchQuery
              ? `We could not find any categories matching "${searchQuery}".`
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
      removeClippedSubviews={Platform.OS === "android"}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  )
}
