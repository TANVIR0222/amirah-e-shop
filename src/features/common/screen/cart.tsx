import { useCart } from "@/lib/storage/cart-storage"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function CartScreen() {
  const { colors } = useAppTheme()
  const insets = useSafeAreaInsets()

  const {
    cart: cartItems,
    subtotal,
    savings,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
  } | null>({ code: "SAVE50", discount: 50 })
  const [couponError, setCouponError] = useState("")

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const freeDeliveryThreshold = 650
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal)
  const deliveryFee =
    subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 60
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee)

  const handleUpdateQuantity = (id: string | number, delta: number) => {
    updateQuantity(id, delta)
  }

  const handleRemoveItem = (id: string | number) => {
    removeFromCart(id)
  }

  const handleClearCart = () => {
    clearCart()
    setAppliedCoupon(null)
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return

    if (couponCode.trim().toUpperCase() === "EID100") {
      setAppliedCoupon({ code: "EID100", discount: 100 })
      setCouponError("")
      setCouponCode("")
    } else if (couponCode.trim().toUpperCase() === "SAVE50") {
      setAppliedCoupon({ code: "SAVE50", discount: 50 })
      setCouponError("")
      setCouponCode("")
    } else {
      setCouponError("Invalid coupon code. Try SAVE50 or EID100")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError("")
  }

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View
        style={tw.style("px-4 pb-3 border-b border-gray-100", {
          paddingTop: Math.max(insets.top + 8, 16),
          backgroundColor: colors.background,
        })}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={8}
              style={tw.style(
                "w-9 h-9 rounded-full items-center justify-center border",
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              )}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <View>
              <Text
                style={tw.style("text-xl font-bold", { color: colors.text })}
              >
                My Cart
              </Text>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                selected
              </Text>
            </View>
          </View>

          {cartItems.length > 0 && (
            <TouchableOpacity
              onPress={handleClearCart}
              style={tw`px-3 py-1.5 rounded-full bg-red-50 border border-red flex-row items-center gap-1`}
            >
              <Ionicons name="trash-outline" size={14} color="#DC2626" />
              <Text style={tw`text-xs font-semibold text-red-600`}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── EMPTY CART STATE ── */}
      {cartItems.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center p-6 gap-4`}>
          <View
            style={tw`w-24 h-24 rounded-full bg-red-50 items-center justify-center`}
          >
            <Ionicons name="bag-handle-outline" size={48} color="#F0653A" />
          </View>
          <Text
            style={tw.style("text-xl font-bold text-center", {
              color: colors.text,
            })}
          >
            Your Shopping Cart is Empty
          </Text>
          <Text
            style={tw.style("text-xs text-center leading-5 max-w-[280px]", {
              color: colors.mutedForeground,
            })}
          >
            Looks like you haven&apos;t added anything to your cart yet.
            Discover fresh products and great deals today!
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(drawer)/(tabs)/shop")}
            style={tw`mt-2 px-6 py-3.5 rounded-2xl bg-[#F0653A] flex-row items-center gap-2`}
          >
            <Ionicons name="storefront-outline" size={18} color="#FFF" />
            <Text style={tw`text-sm font-bold text-white`}>
              Start Shopping Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw.style("p-4 gap-4", {
              paddingBottom: Math.max(insets.bottom + 120, 140),
            })}
          >
            {/* Free Shipping Progress Indicator */}

            {/* Cart Items List */}
            <View style={tw`gap-3`}>
              {cartItems.map((item) => (
                <View
                  key={item.id}
                  style={tw.style(
                    "p-3.5 rounded-2xl border flex-row gap-3 items-center",
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }
                  )}
                >
                  <Image
                    source={
                      typeof item?.image === "number"
                        ? item.image
                        : {
                            uri:
                              typeof item?.image === "string" &&
                              item.image.trim() !== ""
                                ? item.image
                                : "https://amiraheshop.com/images/product/202607170221361.jpeg",
                          }
                    }
                    style={tw`w-20 h-20 rounded-xl bg-gray-100`}
                    contentFit="cover"
                  />

                  <View style={tw`flex-1 gap-1`}>
                    <View style={tw`flex-row justify-between items-start`}>
                      <Text
                        style={tw.style("text-sm font-bold flex-1 mr-2", {
                          color: colors.text,
                        })}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        hitSlop={6}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={18}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={tw.style("text-[11px]", {
                        color: colors.mutedForeground,
                      })}
                    >
                      {item.unit}
                    </Text>

                    <View
                      style={tw`flex-row items-center justify-between mt-1.5`}
                    >
                      <View style={tw`flex-row items-baseline gap-1.5`}>
                        <Text style={tw`text-sm font-bold text-[#F0653A]`}>
                          ৳{item.price}
                        </Text>
                        {item.originalPrice && (
                          <Text
                            style={tw`text-[11px] text-gray-400 line-through`}
                          >
                            ৳{item.originalPrice}
                          </Text>
                        )}
                      </View>

                      {/* Quantity Controller */}
                      <View
                        style={tw.style(
                          "flex-row items-center border rounded-xl overflow-hidden bg-gray-50",
                          { borderColor: colors.border }
                        )}
                      >
                        <TouchableOpacity
                          onPress={() => handleUpdateQuantity(item.id, -1)}
                          style={tw`w-7 h-7 items-center justify-center bg-white`}
                        >
                          <Ionicons
                            name="remove"
                            size={14}
                            color={colors.text}
                          />
                        </TouchableOpacity>

                        <Text
                          style={tw.style("w-8 text-center text-xs font-bold", {
                            color: colors.text,
                          })}
                        >
                          {item.quantity}
                        </Text>

                        <TouchableOpacity
                          onPress={() => handleUpdateQuantity(item.id, 1)}
                          style={tw`w-7 h-7 items-center justify-center bg-white`}
                        >
                          <Ionicons name="add" size={14} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Promo Code Coupon Card */}
            {/* <View
              style={tw.style("p-4 rounded-2xl border gap-3", {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              })}
            >
              <Text
                style={tw.style("text-sm font-bold", { color: colors.text })}
              >
                Apply Promo Code / Coupon
              </Text>

              {appliedCoupon ? (
                <View
                  style={tw`flex-row items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200`}
                >
                  <View style={tw`flex-row items-center gap-2`}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#16A34A"
                    />
                    <View>
                      <Text style={tw`text-xs font-bold text-green-900`}>
                        {appliedCoupon.code} Applied!
                      </Text>
                      <Text style={tw`text-[11px] text-green-700`}>
                        You save ৳{appliedCoupon.discount} on this order
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={handleRemoveCoupon}>
                    <Text style={tw`text-xs font-bold text-red-600`}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={tw`flex-row gap-2`}>
                  <TextInput
                    style={tw.style(
                      "flex-1 border rounded-xl px-3.5 h-10 text-xs uppercase",
                      {
                        backgroundColor: colors.background,
                        borderColor: couponError ? "#EF4444" : colors.border,
                        color: colors.text,
                      }
                    )}
                    placeholder="Enter coupon (e.g. SAVE50)"
                    placeholderTextColor={colors.mutedForeground}
                    value={couponCode}
                    onChangeText={(val) => {
                      setCouponCode(val)
                      setCouponError("")
                    }}
                    autoCapitalize="characters"
                  />

                  <TouchableOpacity
                    onPress={handleApplyCoupon}
                    style={tw`px-4 h-10 rounded-xl bg-[#F0653A] items-center justify-center`}
                  >
                    <Text style={tw`text-xs font-bold text-white`}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}

              {couponError ? (
                <Text style={tw`text-xs text-red-500 font-medium ml-1`}>
                  {couponError}
                </Text>
              ) : null}
            </View> */}
          </ScrollView>

          {/* ── STICKY CHECKOUT BOTTOM BAR ── */}
          <View
            style={tw.style(
              "absolute bottom-0 left-0 right-0 p-4 border-t flex-row items-center justify-between gap-4",
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                paddingBottom: Math.max(insets.bottom + 12, 16),
              }
            )}
          >
            <View>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Total Payable
              </Text>
              <Text style={tw`text-xl font-bold text-[#F0653A]`}>
                ৳{subtotal}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/checkout/order-details")}
              style={tw`flex-1 h-12 rounded-2xl bg-[#F0653A] flex-row items-center justify-center gap-2 shadow-sm`}
            >
              <Text style={tw`text-sm font-bold text-white`}>
                Proceed to Checkout
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
