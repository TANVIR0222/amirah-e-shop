import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useState } from "react"
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import ProductImageSlider from "../components/product-image-slider"

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

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    id: "2",
    name: "Fresh Red Tomato (500 Gm)",
    category: "Fresh Vegetables",
    price: 48,
    originalPrice: 60,
    rating: 4.7,
    unit: "500 Gm",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
  },
  {
    id: "3",
    name: "Onion Premium (1 Kg)",
    category: "Spices & Veg",
    price: 72,
    originalPrice: 85,
    rating: 4.9,
    unit: "1 Kg",
    image: "https://amiraheshop.com/images/product/202607170959351.jpg",
  },
  {
    id: "4",
    name: "Carrot Fresh (500 Gm)",
    category: "Fresh Vegetables",
    price: 38,
    originalPrice: 45,
    rating: 4.6,
    unit: "500 Gm",
    image: "https://amiraheshop.com/images/product/202607170221361.jpeg",
  },
  {
    id: "5",
    name: "Broccoli Organic",
    category: "Organic Produce",
    price: 95,
    originalPrice: 110,
    rating: 4.8,
    unit: "1 Pc",
    image: "https://amiraheshop.com/images/product/202607171216481.jpeg",
  },
]

export default function ProductDetailsScreen() {
  const { colors } = useAppTheme()
  const { bottom, top } = useSafeAreaInsets()

  // States
  const [activeSize, setActiveSize] = useState(staticProduct.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [likedRelated, setLikedRelated] = useState<Record<string, boolean>>({})

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
        <ProductImageSlider images={staticProduct?.images} />

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
              color={isFavorite ? "#C52405" : colors.text}
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
                {staticProduct.product_name}
              </Text>

              <View
                style={tw`flex-row gap-1 items-center bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200`}
              >
                <Ionicons name="star" size={14} color="#D97706" />
                <Text style={tw`text-xs font-bold text-amber-700`}>
                  {staticProduct.ratting}
                </Text>
              </View>
            </View>

            {/* Brand & Category */}
            <View style={tw`flex-row gap-2 items-center`}>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Category:{" "}
                <Text style={tw`font-semibold text-[#C52405]`}>
                  {staticProduct.category}
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
                  {staticProduct.brand}
                </Text>
              </Text>
            </View>
          </View>

          {/* Price & Quantity Controls */}
          <View
            style={tw.style(
              "flex-row justify-between items-center py-3 border-y",
              { borderColor: colors.border }
            )}
          >
            <View style={tw`gap-0.5`}>
              <View style={tw`flex-row items-baseline gap-2`}>
                <Text style={tw`text-2xl font-bold text-[#C52405]`}>
                  {staticProduct.currency} {staticProduct.price}
                </Text>
                {staticProduct.originalPrice && (
                  <Text style={tw`text-sm text-gray-400 line-through`}>
                    ৳{staticProduct.originalPrice}
                  </Text>
                )}
              </View>
              <Text
                style={tw.style("text-xs font-medium", {
                  color: colors.mutedForeground,
                })}
              >
                {staticProduct.selling_count}+ Sold recently
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
                <Ionicons name="add" size={16} color="#C52405" />
              </TouchableOpacity>
            </View>
          </View>

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
              {staticProduct.sizes.map((item) => {
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
                            borderColor: "#C52405",
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
                      color={isActive ? "#C52405" : colors.mutedForeground}
                    />
                    <Text
                      style={tw.style("text-xs font-bold", {
                        color: isActive ? "#C52405" : colors.text,
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
              {staticProduct.description}
            </Text>
          </View>

          {/* ── RELATED PRODUCTS SECTION ── */}
          <View style={tw`flex-col gap-3 mt-4 pt-4 border-t border-gray-100`}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text
                style={tw.style("text-base font-bold", { color: colors.text })}
              >
                Related Products
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/(drawer)/(tabs)/shop")}
              >
                <Text style={tw`text-xs font-bold text-[#C52405]`}>
                  View All →
                </Text>
              </TouchableOpacity>
            </View>

            {/* Related Products Horizontal List */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`gap-3.5`}
            >
              {RELATED_PRODUCTS.map((item) => {
                const isLiked = likedRelated[item.id] || false

                return (
                  <View
                    key={item.id}
                    style={tw.style(
                      "w-44 rounded-2xl border overflow-hidden p-2.5 gap-2 relative",
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      }
                    )}
                  >
                    {/* Image & Favorite overlay */}
                    <View style={tw`relative rounded-xl overflow-hidden`}>
                      <Image
                        source={{ uri: item.image }}
                        style={tw`w-full h-32 bg-gray-100`}
                        resizeMode="cover"
                      />

                      <TouchableOpacity
                        onPress={() => toggleRelatedLike(item.id)}
                        hitSlop={6}
                        style={tw`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 items-center justify-center z-10 shadow-sm`}
                      >
                        <Ionicons
                          name={isLiked ? "heart" : "heart-outline"}
                          size={14}
                          color={isLiked ? "#C52405" : "#6B7280"}
                        />
                      </TouchableOpacity>

                      <View
                        style={tw`absolute bottom-2 left-2 bg-amber-500/90 px-1.5 py-0.5 rounded-md flex-row items-center gap-0.5`}
                      >
                        <Ionicons name="star" size={10} color="#FFF" />
                        <Text style={tw`text-[10px] font-bold text-white`}>
                          {item.rating}
                        </Text>
                      </View>
                    </View>

                    {/* Content info */}
                    <View style={tw`gap-1`}>
                      <Text
                        style={tw.style("text-xs font-bold", {
                          color: colors.text,
                        })}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>

                      <Text
                        style={tw.style("text-[10px]", {
                          color: colors.mutedForeground,
                        })}
                      >
                        {item.unit}
                      </Text>

                      <View
                        style={tw`flex-row items-center justify-between mt-1`}
                      >
                        <View style={tw`flex-row items-baseline gap-1`}>
                          <Text style={tw`text-xs font-bold text-[#C52405]`}>
                            ৳{item.price}
                          </Text>
                          {item.originalPrice && (
                            <Text
                              style={tw`text-[10px] text-gray-400 line-through`}
                            >
                              ৳{item.originalPrice}
                            </Text>
                          )}
                        </View>

                        <TouchableOpacity
                          onPress={() => router.push("/cart")}
                          style={tw`w-7 h-7 rounded-xl bg-red-50 border border-red-100 items-center justify-center`}
                        >
                          <Ionicons
                            name="bag-add-outline"
                            size={14}
                            color="#C52405"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          </View>
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
                    borderColor: "#C52405",
                  }
            )}
          >
            <Ionicons
              name={isAddedToCart ? "checkmark-circle" : "cart-outline"}
              size={18}
              color={isAddedToCart ? "#16A34A" : "#C52405"}
            />
            <Text
              style={tw.style("text-sm font-bold", {
                color: isAddedToCart ? "#16A34A" : "#C52405",
              })}
            >
              {isAddedToCart ? "Added to Cart" : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(modal)/order-summery-modal")}
            style={tw`flex-1 h-12 rounded-2xl bg-[#C52405] flex-row items-center justify-center gap-2 shadow-sm`}
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
