import Skeleton from "@/components/ui/skeleton"
import tw from "@/lib/tailwind"
import React from "react"
import { FlatList, View } from "react-native"

interface ShopCardSkeletonProps {
  cardWidth: number
  scrollEnabled?: boolean
}

const ShopCardSkeleton: React.FC<ShopCardSkeletonProps> = ({
  cardWidth,
  scrollEnabled = true,
}) => {
  const items = Array.from({ length: 10 })

  const renderSkeletonCard = (key: string | number) => (
    <View
      key={key}
      style={tw.style(
        `rounded-2xl overflow-hidden border mb-3 shadow-xs bg-white border-gray-200`,
        { width: cardWidth }
      )}
    >
      {/* Image Area Skeleton */}
      <Skeleton width="100%" height={144} style={tw`rounded-none`} />

      {/* Text Area Skeleton */}
      <View style={tw`p-3 items-center justify-center flex-col gap-1.5`}>
        <Skeleton width="85%" height={12} style={tw`rounded-sm`} />
        <Skeleton width="50%" height={12} style={tw`rounded-sm`} />
      </View>
    </View>
  )

  if (!scrollEnabled) {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 16,
          paddingBottom: 32,
        }}
      >
        {items.map((_, index) => renderSkeletonCard(`skeleton-${index}`))}
      </View>
    )
  }

  return (
    <FlatList
      data={items}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      keyExtractor={(_, index) => `skeleton-${index}`}
      columnWrapperStyle={{ justifyContent: "space-between", gap: 12 }}
      contentContainerStyle={tw`mt-4 pb-8`}
      renderItem={({ index }) => renderSkeletonCard(`skeleton-${index}`)}
    />
  )
}

export default ShopCardSkeleton
