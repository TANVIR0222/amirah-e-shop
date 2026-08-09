import { ScrollView, View } from "react-native"
import tw from "twrnc"
import Skeleton from "../../../../components/ui/skeleton"

const ProductDetailsSkeleton = () => {
  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header & Image Section Skeleton */}
      <View style={tw`h-[360px] relative bg-gray-100`}>
        {/* Main Image Skeleton */}
        <Skeleton width="100%" height={360} style={tw`rounded-none`} />

        {/* Top Floating Buttons (Back & Favorite) Skeleton */}
        <View
          style={
            tw`absolute left-4 right-4 flex-row justify-between items-center z-20 pt-10` // Adjusted pt-10 as an approximate safe area top
          }
        >
          {/* Back Button Skeleton */}
          <Skeleton width={40} height={40} style={tw`rounded-full`} />
          {/* Favorite Button Skeleton */}
          <Skeleton width={40} height={40} style={tw`rounded-full`} />
        </View>
      </View>

      {/* Main Content Scroll View Skeleton */}
      <View style={tw`flex-1 bg-white -mt-7 rounded-t-3xl pt-5 shadow-lg`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw.style("px-4 pb-32 flex-col gap-5")}
          scrollEnabled={false} // Disable scrolling while loading
        >
          {/* Header Info Skeleton */}
          <View style={tw`flex-col gap-3`}>
            {/* Title & Rating */}
            <View style={tw`flex-row justify-between items-start`}>
              {/* Title */}
              <Skeleton width="70%" height={28} style={tw`rounded-md`} />
              {/* Rating Badge */}
              <Skeleton width={50} height={24} style={tw`rounded-full`} />
            </View>

            {/* Brand & Category */}
            <View style={tw`flex-row gap-2 items-center`}>
              <Skeleton width="50%" height={16} style={tw`rounded-md`} />
            </View>
          </View>

          {/* Price & Quantity Controls Skeleton */}
          <View style={tw`flex-row justify-between items-center rounded py-3`}>
            {/* Price & Stock */}
            <View style={tw`gap-2`}>
              <Skeleton width={110} height={32} style={tw`rounded-md`} />
              <Skeleton width={70} height={16} style={tw`rounded-md`} />
            </View>

            {/* Quantity Selector */}
            <Skeleton width={115} height={38} style={tw`rounded-2xl`} />
          </View>

          {/* Coupons Button Skeleton */}
          <Skeleton width="100%" height={50} style={tw`rounded-xl`} />

          {/* Variations / Weight Skeleton */}
          <View style={tw`flex-col gap-3 mt-1`}>
            {/* Variation Title */}
            <Skeleton width={160} height={20} style={tw`rounded-md`} />
            {/* Horizontal Variation Pills */}
            <View style={tw`flex-row gap-2.5`}>
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  width={80}
                  height={36}
                  style={tw`rounded-2xl`}
                />
              ))}
            </View>
          </View>

          {/* Description Section Skeleton */}
          <View style={tw`flex-col gap-3 mt-4`}>
            <Skeleton width={130} height={20} style={tw`rounded-md`} />
            <View style={tw`flex-col gap-2`}>
              <Skeleton width="100%" height={14} style={tw`rounded-md`} />
              <Skeleton width="95%" height={14} style={tw`rounded-md`} />
              <Skeleton width="85%" height={14} style={tw`rounded-md`} />
              <Skeleton width="60%" height={14} style={tw`rounded-md`} />
            </View>
          </View>

          {/* Related Products Section Skeleton */}
          <View style={tw`flex-col gap-3 mt-4`}>
            <Skeleton width={150} height={20} style={tw`rounded-md`} />
            <View style={tw`flex-row gap-3`}>
              {/* Assuming standard vertical product cards for related products */}
              <Skeleton width={140} height={180} style={tw`rounded-2xl`} />
              <Skeleton width={140} height={180} style={tw`rounded-2xl`} />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar Skeleton */}
        <View
          style={tw.style(
            "absolute bottom-0 left-0 right-0 p-4 border-t flex-row items-center gap-3 bg-white",
            {
              paddingBottom: 32, // Adjust this based on your `bottom + 12` safe area logic
              borderColor: "#e5e7eb", // colors.border equivalent
            }
          )}
        >
          {/* Add to Cart Button Skeleton */}
          <Skeleton width="48%" height={48} style={tw`flex-1 rounded-2xl`} />

          {/* Buy Now Button Skeleton */}
          <Skeleton width="48%" height={48} style={tw`flex-1 rounded-2xl`} />
        </View>
      </View>
    </View>
  )
}

export default ProductDetailsSkeleton
