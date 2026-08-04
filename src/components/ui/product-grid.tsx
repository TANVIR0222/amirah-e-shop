import tw from "@/lib/tailwind"
import { PRODUCTS } from "@/utils/ui-data"
import { Dimensions, FlatList } from "react-native"
import { ProductCard } from "./product-card"

const OUTER_PADDING = 24
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

export function ProductGrid({
  data = PRODUCTS,
  onLoadMore,
  onRefresh,
  refreshing = false,
  ListFooterComponent,
}: ProductGridProps) {
  return (
    <FlatList
      data={data}
      numColumns={NUM_COLUMNS}
      keyExtractor={(item) => String(item.id)}
      scrollEnabled={false}
      columnWrapperStyle={
        NUM_COLUMNS > 1
          ? { gap: GAP, justifyContent: "space-between" }
          : undefined
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => <ProductCard item={item} />}
      contentContainerStyle={tw`gap-3 pb-5 mt-4`}
      ListFooterComponent={ListFooterComponent}
    />
  )
}
