import tw from "@/lib/tailwind"
import { PRODUCTS } from "@/utils/ui-data"
import React, { memo, useCallback } from "react"
import { Dimensions, FlatList } from "react-native"
import { ProductCard } from "./product-card"

const GAP = 12
const SCREEN_WIDTH = Dimensions.get("window").width
const NUM_COLUMNS = SCREEN_WIDTH < 380 ? 1 : 2

interface ProductGridProps {
  data?: any[]
  loadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onRefresh?: () => void
  refreshing?: boolean
  ListFooterComponent?: React.ReactElement | null
}

export const ProductGrid = memo(
  ({
    data = PRODUCTS,
    onLoadMore,
    onRefresh,
    refreshing = false,
    ListFooterComponent,
  }: ProductGridProps) => {
    const renderItem = useCallback(
      ({ item }: { item: any }) => <ProductCard item={item} />,
      []
    )

    const keyExtractor = useCallback((item: any) => String(item.id), [])

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        columnWrapperStyle={
          NUM_COLUMNS > 1
            ? { justifyContent: "space-between", gap: GAP }
            : undefined
        }
        contentContainerStyle={tw`mt-4 pb-5 gap-3`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.4}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListFooterComponent={ListFooterComponent}
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
