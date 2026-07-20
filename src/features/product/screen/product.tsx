import tw from "@/lib/tailwind"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"
import ProductImageSlider from "../components/product-image-slider"

// Assuming you have these or similar. I've added basic fallback icons below just in case.
// import ImageSlider from "@/components/common/image-slider";

// --- Mocked SVG Icons for Favorite, Plus, Minus ---
const HeartIconOutline = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C86D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
const HeartIconFilled = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#2C86D1" stroke="#2C86D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`

// --- Static Product Data ---
const staticProduct = {
  id: "1",
  product_name: "Golden Grain Dried Chillies (Shukna Morich)",
  category: "Spices",
  brand: "Amirah E Shop",
  price: 70,
  currency: "BDT",
  ratting: 4.8,
  selling_count: 340,
  description:
    "Premium quality dried chillies, sun-dried to perfection for a rich, spicy flavor and deep red color. Perfect for adding a fiery kick to your curries, stir-fries, marinades, and traditional Bangladeshi dishes. Sourced directly from local farmers to ensure maximum freshness and authenticity.",
  sizes: ["100g", "250g", "500g", "1kg"],
  images: [
    "https://amiraheshop.com/images/product/202607170221361.jpeg",
    "https://amiraheshop.com/images/product/202607171216481.jpeg",
  ],
}

export default function ProductDetailsScreen() {
  const { bottom } = useSafeAreaInsets()

  // States
  const [activeSize, setActiveSize] = useState(staticProduct.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  // Handlers
  const handleIncrease = () => setQuantity((prev) => prev + 1)
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    // showToast.success(`Added ${quantity} item(s) to cart!`);
  }

  return (
    <View style={tw`flex-1 bg-[#FFFFFF] pb-[${bottom}px]`}>
      {/* Header & Image Section */}
      <View style={tw`h-[360px] relative bg-gray-100`}>
        {/* Replace this with an actual Image component if ImageSlider doesn't accept external URLs in your setup */}
        <ProductImageSlider images={staticProduct?.images} />

        {/* Top Floating Buttons */}
        <View
          style={tw`absolute top-10 right-0 right-0 px-[4%] flex-row justify-between items-center`}
        >
          {/* <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={tw`w-11 h-11 rounded-full bg-white items-center justify-center shadow-sm`}
          >
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.8}
            style={tw`w-11 h-11 rounded-full bg-white items-center justify-center shadow-sm`}
          >
            <SvgXml xml={isFavorite ? HeartIconFilled : HeartIconOutline} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View
        style={tw`flex-1 bg-[#FFFFFF] px-[4%] -mt-7 rounded-t-3xl pt-5 shadow-lg`}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-28 flex-col gap-5`}
        >
          {/* Header Info */}
          <View style={tw`flex-col gap-2`}>
            {/* Title & Rating */}
            <View style={tw`flex-row justify-between items-start`}>
              <Text
                style={tw`text-2xl font-geist-semibold text-heading_black flex-1 pr-2`}
              >
                {staticProduct.product_name}
              </Text>

              <View
                style={tw`flex-row gap-1 items-center bg-[#FFF8E1] px-2 py-1 rounded-lg`}
              >
                {/* {IconsStart && <SvgXml xml={IconsStart} width={16} height={16} />} */}
                <Text style={tw`text-sm font-inter-semibold text-[#FFB300]`}>
                  {staticProduct.ratting}
                </Text>
              </View>
            </View>

            {/* Brand & Category */}
            <View style={tw`flex-row gap-2 items-center`}>
              <Text style={tw`text-sm font-inter-regular text-[#757575]`}>
                Category:{" "}
                <Text style={tw`text-[#2C86D1]`}>{staticProduct.category}</Text>
              </Text>
              <Text style={tw`text-sm text-[#E0E0E0]`}>|</Text>
              <Text style={tw`text-sm font-inter-regular text-[#757575]`}>
                Brand:{" "}
                <Text style={tw`text-heading_black`}>
                  {staticProduct.brand}
                </Text>
              </Text>
            </View>
          </View>

          {/* Price & Quantity Controls */}
          <View
            style={tw`flex-row justify-between items-center py-2 border-y border-gray-100`}
          >
            <View>
              <Text style={tw`text-2xl font-geist-bold text-[#1C79BE]`}>
                {staticProduct.currency}
                {staticProduct.price}
              </Text>
              <Text
                style={tw`text-xs font-inter-regular text-description3 mt-1`}
              >
                {staticProduct.selling_count}+ Sold
              </Text>
            </View>

            {/* Quantity Selector */}
            <View
              style={tw`flex-row items-center bg-[#F5F5F5] rounded-full border border-gray-200`}
            >
              <TouchableOpacity
                onPress={handleDecrease}
                activeOpacity={0.7}
                style={tw`w-10 h-10 items-center justify-center`}
              >
                <Text style={tw`text-lg font-bold text-[#606060]`}>-</Text>
              </TouchableOpacity>

              <Text
                style={tw`text-base font-geist-semibold text-heading_black w-6 text-center`}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={handleIncrease}
                activeOpacity={0.7}
                style={tw`w-10 h-10 items-center justify-center`}
              >
                <Text style={tw`text-lg font-bold text-[#2C86D1]`}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Variations / Weight */}
          <View style={tw`flex-col gap-3 mt-2`}>
            <Text style={tw`text-base font-geist-medium text-heading_black`}>
              Select Weight
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`flex-row gap-3`}
            >
              {staticProduct.sizes.map((item) => {
                const isActive = activeSize === item
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={item}
                    onPress={() => setActiveSize(item)}
                    style={[
                      tw`px-5 py-2 rounded-full border`,
                      isActive
                        ? tw`bg-[#EAF4FB] border-[#2C86D1]`
                        : tw`bg-white border-[#E0E0E0]`,
                    ]}
                  >
                    <Text
                      style={[
                        tw`text-sm font-inter-medium`,
                        isActive ? tw`text-[#1C79BE]` : tw`text-[#606060]`,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>

          {/* Static Description Section */}
          <View style={tw`flex-col gap-2 mt-4`}>
            <Text style={tw`text-base font-geist-medium text-heading_black`}>
              Product Details
            </Text>
            <Text
              style={tw`text-[15px] leading-6 text-[#757575] font-inter-regular`}
            >
              {staticProduct.description}
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View
          style={tw`absolute bottom-4 left-5 right-5 flex-row justify-between gap-3 bg-white pt-2`}
        >
          {!isAddedToCart ? (
            <TouchableOpacity
              onPress={handleAddToCart}
              activeOpacity={0.8}
              style={tw`flex-1 h-14 rounded-full bg-[#DCEBF8] items-center justify-center`}
            >
              <Text style={tw`text-[#2C86D1] text-[16px] font-semibold`}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(modal)/product-modal")}
            style={[
              tw`h-14 rounded-full bg-[#2C86D1] items-center justify-center`,
              isAddedToCart ? tw`flex-1` : tw`flex-1`,
            ]}
          >
            <Text style={tw`text-white text-[16px] font-semibold`}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
