import ShopCardSkeleton from "@/features/shop/components/skeleton/all-category-skeleton"
import tw from "@/lib/tailwind"
import React, { memo, useCallback } from "react"
import { Dimensions, FlatList, StyleProp, View, ViewStyle } from "react-native"
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
  contentContainerStyle?: StyleProp<ViewStyle>
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
      (item: any, index: number) => (
        <ProductCard
          key={item?.id != null ? String(item.id) : `idx-${index}`}
          item={item}
        />
      ),
      []
    )

    if (isLoading && safeData.length === 0) {
      return (
        <ShopCardSkeleton
          cardWidth={CARD_WIDTH}
          scrollEnabled={scrollEnabled}
        />
      )
    }

    // When nested inside a ScrollView (e.g. HomeScreen), render a regular flexbox grid
    // to avoid "VirtualizedLists should never be nested inside plain ScrollViews" warning
    if (!scrollEnabled) {
      return (
        <View style={[tw`mt-4 pb-8`, contentContainerStyle]}>
          {ListHeaderComponent}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: GAP,
            }}
          >
            {safeData.map(renderItem)}
          </View>
          {ListFooterComponent}
        </View>
      )
    }

    return (
      <FlatList
        data={safeData}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item, index) =>
          item?.id != null ? String(item.id) : `idx-${index}`
        }
        numColumns={NUM_COLUMNS}
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
