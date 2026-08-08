import Skeleton from "@/components/ui/skeleton"
import React from "react"
import { FlatList, View } from "react-native"
import tw from "twrnc"

interface CategoryCardSkeletonProps {
  cardWidth: number
}

const CategoryCardSkeleton: React.FC<CategoryCardSkeletonProps> = ({
  cardWidth,
}) => {
  return (
    <FlatList
      data={Array.from({ length: 10 })} // Adjust the number of skeleton cards as needed
      numColumns={2} // Display two columns
      columnWrapperStyle={tw`justify-between px-4`} // Space between columns
      showsVerticalScrollIndicator={false}
      keyExtractor={(_, index) => `skeleton-${index}`}
      renderItem={() => (
        <View
          style={tw.style(
            `rounded-2xl overflow-hidden border mb-3 shadow-xs bg-white border-gray-200`,
            { width: cardWidth }
          )}
        >
          {/* Image Area Skeleton (h-36 is equivalent to 144px) */}
          <Skeleton width="100%" height={144} style={tw`rounded-none`} />

          {/* Text Area Skeleton (Two lines to match numberOfLines={2}) */}
          <View style={tw`p-3 items-center justify-center flex-col gap-1.5`}>
            <Skeleton width="85%" height={12} style={tw`rounded-sm`} />
            <Skeleton width="50%" height={12} style={tw`rounded-sm`} />
          </View>
        </View>
      )}
    />
  )
}

export default CategoryCardSkeleton
