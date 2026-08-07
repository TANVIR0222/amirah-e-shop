import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import { _WIDTH } from "@/utils/phone-screen-size"
import Ionicons from "@expo/vector-icons/Ionicons"
import { RenderHTML } from "@native-html/render"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useGetSingleProductQuery } from "../api/shop-api"
import ProductImageSlider from "../components/product-image-slider"

import ProductCoupons from "../components/product-coupons"
import RelatedProduct from "../components/releted-product"

// --- Static Product Data ---
const staticProduct = {
  id: "1",
  product_name: "Golden Grain Dried Chillies (Shukna Morich)",
  category: "Spices",
  brand: "Amirah E Shop",
  price: 70,
  originalPrice: 85,
  currency: "BDT ৳",
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

// --- Related Products Mock Data ---
type RelatedProduct = {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  unit: string
}

export default function ProductDetailsScreen() {
  const { colors } = useAppTheme()
  const { bottom, top } = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>() // Placeholder for search location query if needed

  // console.log("Product ID from params:", id) // Debugging log for product ID

  // States
  const [activeSize, setActiveSize] = useState(staticProduct.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [likedRelated, setLikedRelated] = useState<Record<string, boolean>>({})

  const { data, isLoading } = useGetSingleProductQuery({ id })
  // console.log("data", data)

  // Handlers
  const handleIncrease = () => setQuantity((prev) => prev + 1)
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    setIsAddedToCart(true)
  }

  const toggleRelatedLike = (id: string) => {
    setLikedRelated((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <View style={styles.container}>
      {/* Header & Image Section */}
      <View style={tw`h-[360px] relative bg-gray-100`}>
        <ProductImageSlider images={data?.data?.images_array} />

        {/* Top Floating Buttons (Back & Favorite) */}
        <View
          style={tw.style(
            "absolute left-4 right-4 flex-row justify-between items-center z-20",
            { paddingTop: Math.max(top + 8, 16) }
          )}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={tw.style(
              "w-10 h-10 rounded-full items-center justify-center border shadow-sm",
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.8}
            style={tw.style(
              "w-10 h-10 rounded-full items-center justify-center border shadow-sm",
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#F0653A" : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Scroll View */}
      <View style={tw`flex-1 bg-white -mt-7 rounded-t-3xl pt-5 shadow-lg`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw.style("px-4 pb-32 flex-col gap-5")}
        >
          {/* Header Info */}
          <View style={tw`flex-col gap-2`}>
            {/* Title & Rating */}
            <View style={tw`flex-row justify-between items-start`}>
              <Text
                style={tw.style("text-xl font-bold flex-1 pr-2", {
                  color: colors.text,
                })}
              >
                {data?.data?.name}
              </Text>

              <View
                style={tw`flex-row gap-1 items-center bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200`}
              >
                <Ionicons name="star" size={14} color="#D97706" />
                <Text style={tw`text-xs font-bold text-amber-700`}>
                  {data?.data?.ratings}
                </Text>
              </View>
            </View>

            {/* Brand & Category */}
            <View style={tw`flex-row gap-2 items-center`}>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Category:{" "}
                <Text style={tw`font-semibold text-[#F0653A]`}>
                  {data?.data?.category?.name}
                </Text>
              </Text>
              <Text style={tw.style("text-xs", { color: colors.border })}>
                |
              </Text>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Brand:{" "}
                <Text style={tw.style("font-semibold", { color: colors.text })}>
                  {data?.data?.brand?.title}
                </Text>
              </Text>
            </View>
          </View>

          {/* Price & Quantity Controls */}
          <View
            style={tw.style(
              "flex-row justify-between items-center rounded px-3 py-3 border",
              { borderColor: colors.border }
            )}
          >
            <View style={tw`gap-0.5`}>
              <View style={tw`flex-row items-baseline gap-2`}>
                <Text style={tw`text-2xl font-bold text-[#F0653A]`}>
                  ৳{data?.data?.price}
                </Text>
                {staticProduct?.originalPrice && (
                  <Text style={tw`text-sm text-gray-400 line-through`}>
                    ৳{staticProduct?.originalPrice}
                  </Text>
                )}
              </View>
              <Text
                style={tw.style("text-xs font-medium", {
                  color: colors.mutedForeground,
                })}
              >
                {data?.data?.qty} in stock
              </Text>
            </View>

            {/* Quantity Selector */}
            <View
              style={tw.style(
                "flex-row items-center rounded-2xl border bg-gray-50 overflow-hidden",
                { borderColor: colors.border }
              )}
            >
              <TouchableOpacity
                onPress={handleDecrease}
                activeOpacity={0.7}
                style={tw`w-9 h-9 items-center justify-center bg-white`}
              >
                <Ionicons name="remove" size={16} color={colors.text} />
              </TouchableOpacity>

              <Text
                style={tw.style("text-sm font-bold w-8 text-center", {
                  color: colors.text,
                })}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={handleIncrease}
                activeOpacity={0.7}
                style={tw`w-9 h-9 items-center justify-center bg-white`}
              >
                <Ionicons name="add" size={16} color="#F0653A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* add a Button Coupons and when click show a modal to select coupon */}
          <ProductCoupons />

          {/* Variations / Weight */}
          <View style={tw`flex-col gap-2.5 mt-1`}>
            <Text style={tw.style("text-sm font-bold", { color: colors.text })}>
              Select Weight / Variant
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`flex-row gap-2.5`}
            >
              {data?.data?.sizes_weights.map((item) => {
                const isActive = activeSize === item
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={item}
                    onPress={() => setActiveSize(item)}
                    style={tw.style(
                      "px-4 py-2 rounded-2xl border flex-row items-center gap-1.5",
                      isActive
                        ? {
                            backgroundColor: "#FEF2F2",
                            borderColor: "#F0653A",
                          }
                        : {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          }
                    )}
                  >
                    <Ionicons
                      name={isActive ? "checkmark-circle" : "ellipse-outline"}
                      size={14}
                      color={isActive ? "#F0653A" : colors.mutedForeground}
                    />
                    <Text
                      style={tw.style("text-xs font-bold", {
                        color: isActive ? "#F0653A" : colors.text,
                      })}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>

          {/* Description Section */}
          <View style={tw`flex-col gap-2 mt-1`}>
            <Text style={tw.style("text-sm font-bold", { color: colors.text })}>
              Product Details
            </Text>
            <Text
              style={tw.style("text-xs leading-5", {
                color: colors.mutedForeground,
              })}
            >
              <RenderHTML
                contentWidth={_WIDTH}
                source={
                  data?.data?.product_details
                    ? { html: data?.data?.description }
                    : { html: "<p>No description available.</p>" }
                }
              />
            </Text>
          </View>

          {/* ── RELATED PRODUCTS SECTION ── */}
          <RelatedProduct id={id} />
        </ScrollView>

        {/* Bottom Action Bar */}
        <View
          style={tw.style(
            "absolute bottom-0 left-0 right-0 p-4 border-t flex-row items-center gap-3",
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingBottom: Math.max(bottom + 12, 16),
            }
          )}
        >
          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.8}
            style={tw.style(
              "flex-1 h-12 rounded-2xl border flex-row items-center justify-center gap-2",
              isAddedToCart
                ? {
                    backgroundColor: "#F0FDF4",
                    borderColor: "#16A34A",
                  }
                : {
                    backgroundColor: "#FEF2F2",
                    borderColor: "#F0653A",
                  }
            )}
          >
            <Ionicons
              name={isAddedToCart ? "checkmark-circle" : "cart-outline"}
              size={18}
              color={isAddedToCart ? "#16A34A" : "#F0653A"}
            />
            <Text
              style={tw.style("text-sm font-bold", {
                color: isAddedToCart ? "#16A34A" : "#F0653A",
              })}
            >
              {isAddedToCart ? "Added to Cart" : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(modal)/order-summery-modal")}
            style={tw`flex-1 h-12 rounded-2xl bg-[#F0653A] flex-row items-center justify-center gap-2 shadow-sm`}
          >
            <Text style={tw`text-sm font-bold text-white`}>Buy Now</Text>
            <Ionicons name="flash-outline" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
