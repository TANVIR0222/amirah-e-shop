import Skeleton from "@/components/ui/skeleton"
import React from "react"
import { FlatList, StyleProp, View, ViewStyle } from "react-native"
import tw from "twrnc"

interface CategoryCardSkeletonProps {
  cardWidth: number
  count?: number
  contentContainerStyle?: StyleProp<ViewStyle>
  columnWrapperStyle?: StyleProp<ViewStyle>
}

const CategoryCardSkeleton: React.FC<CategoryCardSkeletonProps> = ({
  cardWidth,
  count = 10,
  contentContainerStyle,
  columnWrapperStyle,
}) => {
  return (
    <FlatList
      data={Array.from({ length: count })}
      numColumns={2}
      columnWrapperStyle={columnWrapperStyle ?? tw`justify-between px-4 gap-3`}
      contentContainerStyle={contentContainerStyle ?? tw`pt-2 pb-10`}
      showsVerticalScrollIndicator={false}
      keyExtractor={(_, index) => `skeleton-${index}`}
      renderItem={() => (
        <View
          style={tw.style(
            `rounded-2xl overflow-hidden border mb-3 shadow-xs bg-white border-gray-100`,
            { width: cardWidth }
          )}
        >
          {/* Image Area Skeleton */}
          <Skeleton width="100%" height={130} style={tw`rounded-none`} />

          {/* Text Area Skeleton */}
          <View
            style={tw`p-2.5 items-center justify-center flex-col gap-1.5 min-h-[48px]`}
          >
            <Skeleton width="80%" height={12} style={tw`rounded-sm`} />
            <Skeleton width="50%" height={10} style={tw`rounded-sm`} />
          </View>
        </View>
      )}
    />
  )
}

export default CategoryCardSkeleton
