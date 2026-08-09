import Skeleton from "@/components/ui/skeleton"
import React from "react"
import { FlatList, View } from "react-native"
import tw from "twrnc"

interface CategoryCardSkeletonProps {
  cardWidth: number // Pass the same CARD_WIDTH you use in the main component
}

const CategoryCardSkeleton: React.FC<CategoryCardSkeletonProps> = ({
  cardWidth,
}) => {
  return (
    <FlatList
      data={Array.from({ length: 5 })} // Adjust the number of skeleton cards as needed
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => `skeleton-${index}`}
      renderItem={() => (
        <View
          style={tw.style(
            `rounded-2xl h-34 overflow-hidden border mr-3 shadow-xs bg-white border-gray-200`,
            { width: cardWidth }
          )}
        >
          {/* Image Area Skeleton (h-24 equivalent to 96px) */}
          <Skeleton width="100%" height={96} style={tw`rounded-none`} />

          {/* Text Area Skeleton */}
          <View style={tw`p-2.5 items-center justify-center flex-1`}>
            <Skeleton width="75%" height={14} style={tw`rounded-md mt-1`} />
          </View>
        </View>
      )}
    />
  )
}

export default CategoryCardSkeleton
