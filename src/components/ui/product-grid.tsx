import ShopCardSkeleton from "@/features/shop/components/skeleton/all-category-skeleton"
import tw from "@/lib/tailwind"
import React, { memo, useCallback } from "react"
import { Dimensions, FlatList } from "react-native"
import { ProductCard } from "./product-card"

const GAP = 12
const SCREEN_WIDTH = Dimensions.get("window").width
const NUM_COLUMNS = SCREEN_WIDTH < 380 ? 1 : 2
const OUTER_PADDING = 24

const CARD_WIDTH =
  NUM_COLUMNS === 1
    ? SCREEN_WIDTH - OUTER_PADDING * 2
    : (SCREEN_WIDTH - OUTER_PADDING * 2 - GAP) / 2

export interface ProductGridProps {
  data?: any[]
  loadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onRefresh?: () => void
  refreshing?: boolean
  scrollEnabled?: boolean
  contentContainerStyle?: any
  ListHeaderComponent?: React.ReactElement | null
  ListFooterComponent?: React.ReactElement | null
  ListEmptyComponent?: React.ReactElement | null
  isLoading?: boolean
}

export const ProductGrid = memo(
  ({
    data = [],
    onLoadMore,
    onRefresh,
    refreshing = false,
    scrollEnabled = true,
    contentContainerStyle,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    isLoading = false,
  }: ProductGridProps) => {
    const safeData = Array.isArray(data) ? data : []

    const renderItem = useCallback(
      ({ item }: { item: any }) => <ProductCard item={item} />,
      []
    )

    const keyExtractor = useCallback(
      (item: any, index: number) =>
        item?.id != null ? String(item.id) : `idx-${index}`,
      []
    )

    return isLoading ? (
      <ShopCardSkeleton cardWidth={CARD_WIDTH} />
    ) : (
      <FlatList
        data={safeData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        scrollEnabled={scrollEnabled}
        columnWrapperStyle={
          NUM_COLUMNS > 1
            ? { justifyContent: "space-between", gap: GAP }
            : undefined
        }
        contentContainerStyle={[tw`mt-4 pb-8 gap-3`, contentContainerStyle]}
        onEndReached={onLoadMore}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        onEndReachedThreshold={0.4}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        showsVerticalScrollIndicator={false}
      />
    )
  }
)

ProductGrid.displayName = "ProductGrid"
