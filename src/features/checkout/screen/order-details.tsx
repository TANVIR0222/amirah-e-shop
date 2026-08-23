import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import { CartItem, useCart } from "@/lib/storage/cart-storage"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Picker } from "@react-native-picker/picker"
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { Formik } from "formik"
import { useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

import MainButton from "@/components/ui/MainButton"
import { useSession } from "@/features/auth/auth-session"
import ProductCoupons from "@/features/shop/components/product-coupons"
import useAuthUserInfo from "@/hooks/use-auth-user-info"
import { appToast } from "@/lib/toast/app-toast"
import {
  useDeliveryChargerCalculateMutation,
  useSubmitOrderMutation,
} from "../api/checkout-api"
import useZoneLocation from "../hook/use-zone-location"
import { orderDetailsValidationSchema } from "../schema/order-details-validation-schema"

export default function OrderDetails() {
  const { colors } = useAppTheme()
  const { user } = useSession()
  const params = useLocalSearchParams<{
    productId?: string
    productName?: string
    productImage?: string
    unitPrice?: string
    quantity?: string
    variant?: string
    weight?: string
    subtotal?: string
    deliveryCharge?: string
    totalAmount?: string
  }>()

  const { name } = useAuthUserInfo()
  console.log("OrderDetails params:", name)
  const isGuest =
    !user?.email || user?.name === "Guest" || name === "Guest" || !name

  const {
    cart: cartItems,
    subtotal: cartSubtotal,
    clearCart,
    removeFromCart,
  } = useCart()
  const { data: zoneLocations = [], isLoading: isZoneLoading } =
    useZoneLocation()
  const [submitOrder, { isLoading }] = useSubmitOrderMutation()
  const [deliveryChargerCalculate, { isLoading: isDeliveryChargerLoading }] =
    useDeliveryChargerCalculateMutation()
  const [calculatedDeliveryCharge, setCalculatedDeliveryCharge] = useState<
    number | null
  >(null)

  // Determine if direct checkout from single product (Buy Now from id.tsx) or from the Cart
  const isSingleProduct = Boolean(params.productId || params.productName)
  const singleQuantity = Number(params.quantity) || 1
  const singleUnitPrice =
    Number(params.unitPrice) ||
    (params.subtotal ? Number(params.subtotal) / singleQuantity : 0)
  const singleSubtotal = params.subtotal
    ? Number(params.subtotal)
    : singleUnitPrice * singleQuantity

  const effectiveSubtotal = isSingleProduct
    ? singleSubtotal
    : cartSubtotal > 0
      ? cartSubtotal
      : 0

  const orderedItems = isSingleProduct
    ? [
        {
          product_id: Number(params.productId) || params.productId,
          quantity: singleQuantity,
        },
      ]
    : cartItems.map((item: CartItem) => ({
        product_id: Number(item.id) || item.id,
        quantity: item.quantity,
      }))

  const handleOrderSubmit = async (values: any, { resetForm }: any) => {
    if (isGuest) {
      appToast.error("Please log in to place an order.")
      router.push("/(auth)/login")
      return
    }

    const payload = {
      full_name: values.full_name,
      phone_number: values.phone_number,
      district: values.district,
      area: values.area,
      building_or_street: values.house_no,
      colony_or_landmark: values.locality,
      full_address: values.full_address,
      order_note: values.note,
      payment_method: "Cash on Delivery",
      coupon_code: "",
      items: orderedItems,
    }

    try {
      await submitOrder(payload).unwrap()
      appToast.success("Order Submitted Successfully")

      // Clear cart items on successful order
      if (!isSingleProduct) {
        await clearCart()
      } else if (params.productId) {
        await removeFromCart(params.productId, params.variant)
      }

      resetForm()
      router.push("/(drawer)/(tabs)/shop")
    } catch (err: any) {
      console.log("Order Submission Failed:", err)
      appToast.error(err?.message || "Order Submission Failed")
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <>
        <Screen scroll={false}>
          {/* Header */}
          <View style={tw`flex-row items-center gap-3 mb-3`}>
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

            <View style={tw`flex-1`}>
              <Text
                style={tw.style("text-xl font-bold", { color: colors.text })}
              >
                Checkout
              </Text>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Delivery & Payment Information
              </Text>
            </View>

            <View
              style={tw.style("px-2.5 py-1 rounded-full border", {
                backgroundColor: "#FFFBEB",
                borderColor: "#FDE68A",
              })}
            >
              <Text style={tw`text-[11px] font-bold text-amber-700`}>
                BDT ৳
              </Text>
            </View>
          </View>

          <Formik
            initialValues={{
              full_name: "",
              phone_number: "",
              district: "Dhaka",
              area: "Mirpur",
              house_no: "",
              locality: "",
              full_address: "",
              note: "",
              delivery_type: "Cash on Delivery", // "Cash on Delivery"
              payment_method: "COD", // "COD"
            }}
            validationSchema={orderDetailsValidationSchema}
            onSubmit={handleOrderSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => {
              const deliveryCharge =
                calculatedDeliveryCharge !== null
                  ? calculatedDeliveryCharge
                  : values.district === "Dhaka"
                    ? 60
                    : 120
              const total = effectiveSubtotal + deliveryCharge

              return (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={tw`pb-20`}
                  style={tw`flex-1`}
                >
                  <View style={tw`gap-4`}>
                    {/* ORDERED ITEM PREVIEW */}
                    {isSingleProduct ? (
                      <View
                        style={tw.style(
                          "p-3.5 rounded-2xl border flex-row items-center gap-3.5",
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          }
                        )}
                      >
                        <Image
                          source={{
                            uri:
                              params.productImage &&
                              params.productImage.trim() !== ""
                                ? params.productImage
                                : "https://amiraheshop.com/images/product/202607170221361.jpeg",
                          }}
                          style={tw`w-16 h-16 rounded-xl bg-gray-100`}
                          contentFit="cover"
                        />
                        <View style={tw`flex-1 gap-1`}>
                          <Text
                            style={tw.style("text-sm font-bold", {
                              color: colors.text,
                            })}
                            numberOfLines={1}
                          >
                            {params.productName || "Product"}
                          </Text>
                          <View style={tw`flex-row items-center gap-2`}>
                            {params.variant || params.weight ? (
                              <View
                                style={tw.style(
                                  "px-2 py-0.5 rounded-md border",
                                  {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                  }
                                )}
                              >
                                <Text
                                  style={tw.style("text-[11px] font-medium", {
                                    color: colors.mutedForeground,
                                  })}
                                >
                                  {params.variant || params.weight}
                                </Text>
                              </View>
                            ) : null}
                            <Text
                              style={tw.style("text-xs font-semibold", {
                                color: colors.mutedForeground,
                              })}
                            >
                              Qty: {singleQuantity}
                            </Text>
                          </View>
                          <Text
                            style={tw`text-sm font-extrabold text-[#F0653A]`}
                          >
                            ৳ {singleSubtotal.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    ) : cartItems.length > 0 ? (
                      <View
                        style={tw.style("p-3.5 rounded-2xl border gap-2.5", {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        })}
                      >
                        <View
                          style={tw.style(
                            "flex-row items-center justify-between pb-2 border-b",
                            { borderBottomColor: colors.border }
                          )}
                        >
                          <Text
                            style={tw.style("text-xs font-bold", {
                              color: colors.text,
                            })}
                          >
                            Cart Items ({cartItems.length})
                          </Text>
                          <Text style={tw`text-xs font-bold text-[#F0653A]`}>
                            ৳ {effectiveSubtotal.toLocaleString()}
                          </Text>
                        </View>
                        {cartItems.slice(0, 3).map((item: CartItem) => (
                          <View
                            key={item.id}
                            style={tw`flex-row items-center justify-between`}
                          >
                            <Text
                              style={tw.style("text-xs flex-1 mr-2", {
                                color: colors.mutedForeground,
                              })}
                              numberOfLines={1}
                            >
                              {item.name} x {item.quantity}
                            </Text>
                            <Text
                              style={tw.style("text-xs font-semibold", {
                                color: colors.text,
                              })}
                            >
                              ৳ {(item.price * item.quantity).toLocaleString()}
                            </Text>
                          </View>
                        ))}
                        {cartItems.length > 3 ? (
                          <Text style={tw`text-[11px] text-gray-400 italic`}>
                            + {cartItems.length - 3} more item(s)
                          </Text>
                        ) : null}
                      </View>
                    ) : null}

                    <ProductCoupons />

                    {/* SECTION 1: CUSTOMER DETAILS */}
                    <Text
                      style={tw.style("text-base font-bold", {
                        color: colors.text,
                      })}
                    >
                      1. Personal Information
                    </Text>

                    <MainInput
                      label="Full Name *"
                      placeholder="Enter your full name"
                      value={values.full_name}
                      onChangeText={handleChange("full_name")}
                      onBlur={() => handleBlur("full_name")}
                      error={errors.full_name}
                      touched={touched.full_name}
                    />

                    <MainInput
                      label="Phone Number *"
                      placeholder="01XXXXXXXXX"
                      keyboardType="phone-pad"
                      value={values.phone_number}
                      onChangeText={handleChange("phone_number")}
                      onBlur={() => handleBlur("phone_number")}
                      error={errors.phone_number}
                      touched={touched.phone_number}
                    />

                    {/* SECTION 2: DELIVERY ADDRESS */}
                    <Text
                      style={tw.style("text-base font-bold mt-2", {
                        color: colors.text,
                      })}
                    >
                      2. Delivery Address
                    </Text>

                    {/* District & Area Pickers */}
                    {(() => {
                      const activeDistrictObj = zoneLocations?.find(
                        (d) =>
                          d.name.toLowerCase() ===
                          String(values.district || "").toLowerCase()
                      )
                      const currentAreas = activeDistrictObj?.areas ?? []

                      return (
                        <View style={tw`flex-col gap-3`}>
                          {/* District Picker */}
                          <View style={tw`flex-1`}>
                            <Text
                              style={tw.style("mb-2 text-sm font-medium", {
                                color: colors.text,
                              })}
                            >
                              District *
                            </Text>
                            <View
                              style={tw.style(
                                "border rounded-2xl bg-white overflow-hidden",
                                { borderColor: colors.border }
                              )}
                            >
                              <Picker
                                selectedValue={values.district}
                                onValueChange={async (itemValue) => {
                                  setFieldValue("district", itemValue)
                                  const matching = zoneLocations?.find(
                                    (d) =>
                                      d.name.toLowerCase() ===
                                      String(itemValue || "").toLowerCase()
                                  )
                                  const firstArea = matching?.areas?.[0] || ""
                                  setFieldValue("area", firstArea)

                                  if (itemValue) {
                                    try {
                                      const res: any =
                                        await deliveryChargerCalculate({
                                          district: itemValue,
                                        }).unwrap()

                                      const charge =
                                        res?.delivery_charge ??
                                        res?.data?.delivery_charge ??
                                        res?.charge ??
                                        res?.data?.charge ??
                                        res?.amount

                                      if (
                                        charge !== undefined &&
                                        charge !== null
                                      ) {
                                        setCalculatedDeliveryCharge(
                                          Number(charge)
                                        )
                                      }
                                    } catch (error) {
                                      console.log(
                                        "Error calculating delivery charge:",
                                        error
                                      )
                                    }
                                  }
                                }}
                              >
                                <Picker.Item
                                  label={
                                    isZoneLoading
                                      ? "Loading districts..."
                                      : "Select District"
                                  }
                                  value=""
                                />
                                {zoneLocations.map((item) => (
                                  <Picker.Item
                                    key={item.id || item.name}
                                    label={item.name}
                                    value={item.name}
                                  />
                                ))}
                              </Picker>
                            </View>
                            {!!errors.district && touched.district && (
                              <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>
                                {errors.district}
                              </Text>
                            )}
                          </View>

                          {/* Area Picker */}
                          <View style={tw`flex-1`}>
                            <Text
                              style={tw.style("mb-2 text-sm font-medium", {
                                color: colors.text,
                              })}
                            >
                              Area *
                            </Text>
                            <View
                              style={tw.style(
                                "border rounded-2xl bg-white overflow-hidden",
                                { borderColor: colors.border }
                              )}
                            >
                              <Picker
                                selectedValue={values.area}
                                enabled={Boolean(
                                  values.district && currentAreas.length > 0
                                )}
                                onValueChange={(itemValue) =>
                                  setFieldValue("area", itemValue)
                                }
                              >
                                <Picker.Item
                                  label={
                                    !values.district
                                      ? "Select District first"
                                      : currentAreas.length === 0
                                        ? "No areas found"
                                        : "Select Area"
                                  }
                                  value=""
                                />
                                {currentAreas.map((item) => (
                                  <Picker.Item
                                    key={item}
                                    label={item}
                                    value={item}
                                  />
                                ))}
                              </Picker>
                            </View>
                            {!!errors.area && touched.area && (
                              <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>
                                {errors.area}
                              </Text>
                            )}
                          </View>
                        </View>
                      )
                    })()}

                    {/* House No / Street */}
                    <MainInput
                      label="Building / House No / Floor / Street *"
                      placeholder="e.g. House #45, Flat #4B, Road #11"
                      value={values.house_no}
                      onChangeText={handleChange("house_no")}
                      onBlur={() => handleBlur("house_no")}
                      error={errors.house_no}
                      touched={touched.house_no}
                    />

                    {/* Locality / Landmark */}
                    <MainInput
                      label="Colony / Suburb / Locality / Landmark *"
                      placeholder="e.g. Near Mirpur 10 Circle"
                      value={values.locality}
                      onChangeText={handleChange("locality")}
                      onBlur={() => handleBlur("locality")}
                      error={errors.locality}
                      touched={touched.locality}
                    />

                    {/* Full Address */}
                    <MainInput
                      label="Full Address *"
                      placeholder="e.g. House #45, Road #11, Block-D, Mirpur 10, Dhaka"
                      value={values.full_address}
                      onChangeText={handleChange("full_address")}
                      onBlur={() => handleBlur("full_address")}
                      error={errors.full_address}
                      touched={touched.full_address}
                      multiline
                      numberOfLines={3}
                    />

                    {/* Order Note Optional */}
                    <MainInput
                      label="Order Note (Optional)"
                      placeholder="Any special instructions..."
                      value={values.note}
                      onChangeText={handleChange("note")}
                      onBlur={() => handleBlur("note")}
                      multiline
                      numberOfLines={3}
                    />

                    {/* SECTION 3: DELIVERY & PAYMENT OPTION */}
                    <Text
                      style={tw.style("text-base font-bold mt-2", {
                        color: colors.text,
                      })}
                    >
                      3. Delivery & Payment Options
                    </Text>

                    {/* Delivery Type Option */}
                    <View style={tw`flex-row gap-3`}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setFieldValue("delivery_type", "Cash on Delivery")
                          setFieldValue("payment_method", "COD")
                        }}
                        style={tw.style(
                          "w-full p-3.5 rounded-2xl border flex-row items-center gap-2.5",
                          values.delivery_type === "Cash on Delivery"
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
                          name={
                            values.delivery_type === "Cash on Delivery"
                              ? "radio-button-on"
                              : "radio-button-off"
                          }
                          size={18}
                          color={
                            values.delivery_type === "Cash on Delivery"
                              ? "#F0653A"
                              : colors.mutedForeground
                          }
                        />
                        <View style={tw`flex-1`}>
                          <Text
                            style={tw.style("text-xs font-bold", {
                              color: colors.text,
                            })}
                          >
                            Cash on Delivery
                          </Text>
                          <Text
                            style={tw`text-[11px] font-semibold text-green-700`}
                          >
                            Pay when you receive
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Payment Method Details */}
                    <View style={tw`gap-2.5 mt-1`}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setFieldValue("payment_method", "COD")
                          setFieldValue("delivery_type", "Cash on Delivery")
                        }}
                        style={tw.style(
                          "p-3.5 rounded-2xl border flex-row items-center justify-between",
                          values.payment_method === "COD"
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
                        <View style={tw`flex-row items-center gap-3`}>
                          <Ionicons
                            name={
                              values.payment_method === "COD"
                                ? "radio-button-on"
                                : "radio-button-off"
                            }
                            size={18}
                            color={
                              values.payment_method === "COD"
                                ? "#F0653A"
                                : colors.mutedForeground
                            }
                          />
                          <View>
                            <Text
                              style={tw.style("text-xs font-bold", {
                                color: colors.text,
                              })}
                            >
                              Cash on Delivery
                            </Text>
                            <Text
                              style={tw.style("text-[11px]", {
                                color: colors.mutedForeground,
                              })}
                            >
                              Pay after receiving your product
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name="cash-outline"
                          size={22}
                          color="#16A34A"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* SECTION 4: PAYMENT SUMMARY */}
                    <View
                      style={tw.style("p-5 rounded-3xl border mt-3", {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      })}
                    >
                      <Text
                        style={tw.style(
                          "text-base font-bold mb-3 pb-2 border-b",
                          {
                            color: colors.text,
                            borderBottomColor: colors.border,
                          }
                        )}
                      >
                        Payment Summary
                      </Text>

                      <View style={tw`flex-row justify-between mb-2`}>
                        <Text
                          style={tw.style("text-sm", {
                            color: colors.mutedForeground,
                          })}
                        >
                          Subtotal
                        </Text>
                        <Text
                          style={tw.style("text-sm font-semibold", {
                            color: colors.text,
                          })}
                        >
                          ৳ {effectiveSubtotal.toLocaleString()}
                        </Text>
                      </View>

                      <View style={tw`flex-row justify-between mb-2`}>
                        <Text
                          style={tw.style("text-sm", {
                            color: colors.mutedForeground,
                          })}
                        >
                          Delivery Charge (
                          {values.district === "Dhaka"
                            ? "Inside Dhaka"
                            : "Outside Dhaka"}
                          )
                        </Text>
                        <Text style={tw`text-sm font-semibold text-red-600`}>
                          {isDeliveryChargerLoading
                            ? "Calculating..."
                            : `+ ৳ ${deliveryCharge}`}
                        </Text>
                      </View>

                      <View
                        style={tw.style(
                          "flex-row justify-between pt-3 border-t mt-1",
                          { borderTopColor: colors.border }
                        )}
                      >
                        <Text
                          style={tw.style("text-base font-bold", {
                            color: colors.text,
                          })}
                        >
                          Total Amount
                        </Text>
                        <Text style={tw`text-xl font-bold text-red-600`}>
                          ৳ {total.toLocaleString()}
                        </Text>
                      </View>
                    </View>

                    {/* SUBMIT BUTTON */}
                    <View style={tw`pt-4`}>
                      <MainButton
                        title={`Confirm Order (৳ ${total.toLocaleString()})`}
                        onPress={() => handleSubmit()}
                        isLoading={isLoading}
                      />
                    </View>
                  </View>
                </ScrollView>
              )
            }}
          </Formik>
        </Screen>
      </>
    </KeyboardAvoidingWrapper>
  )
}
