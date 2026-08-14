import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router, useLocalSearchParams } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

export interface OrderSummaryParams {
  totalProducts?: string
  weight?: string
  subtotal?: string
  deliveryCharge?: string
  totalAmount?: string
  productId?: string
  productName?: string
  quantity?: string
  variant?: string
}

export default function CheckOutModal() {
  const { colors } = useAppTheme()
  const params = useLocalSearchParams<{
    totalProducts?: string
    weight?: string
    subtotal?: string
    deliveryCharge?: string
    totalAmount?: string
    productId?: string
    productName?: string
    quantity?: string
    variant?: string
  }>()

  const totalProducts =
    params.totalProducts ||
    (params.quantity ? `${params.quantity} Item(s)` : "1 Item(s)")
  const weight = params.weight || params.variant || "Standard"
  const subtotalVal = params.subtotal ? `৳ ${params.subtotal}` : "৳ 0"
  const deliveryChargeVal = params.deliveryCharge
    ? `৳ ${params.deliveryCharge}`
    : "৳ 60"

  const subtotalNum = Number(params.subtotal) || 0
  const deliveryChargeNum =
    params.deliveryCharge !== undefined ? Number(params.deliveryCharge) : 60
  const totalAmountNum =
    params.totalAmount !== undefined
      ? Number(params.totalAmount)
      : subtotalNum + deliveryChargeNum

  const rowData = [
    { label: "Total Product", value: totalProducts },
    { label: "Weight", value: weight },
    { label: "Subtotal", value: subtotalVal },
    { label: "Delivery Charge", value: deliveryChargeVal },
  ]

  const handleGoToCheckout = () => {
    router.push({
      pathname: "/checkout/order-details",
      params: {
        productId: params.productId,
        quantity: params.quantity,
        variant: params.variant,
        subtotal: String(subtotalNum),
        deliveryCharge: String(deliveryChargeNum),
        totalAmount: String(totalAmountNum),
      },
    })
  }

  return (
    <View style={tw.style(`pb-32`, { backgroundColor: colors.background })}>
      {/* Grabber */}
      <View style={tw`items-center pt-3 pb-1`}>
        <View
          style={tw.style(`w-10 h-1 rounded-full`, {
            backgroundColor: colors.border,
          })}
        />
      </View>

      {/* Header */}
      <View
        style={tw.style(
          `flex-row items-center justify-between px-5 py-4 border-b`,
          {
            borderBottomColor: colors.border,
          }
        )}
      >
        <Text style={tw.style(`text-lg font-bold`, { color: colors.text })}>
          Order Summary
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={8}
          style={tw.style(
            `w-8 h-8 rounded-full items-center justify-center border`,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          )}
        >
          <Ionicons name="close" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={tw`px-5 py-5 gap-3`}
        showsVerticalScrollIndicator={false}
      >
        {/* Order rows */}
        <View
          style={tw.style(`rounded-2xl border`, {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          })}
        >
          {rowData.map((row, index) => (
            <View
              key={row.label}
              style={tw.style(
                `flex-row justify-between items-center px-4 py-3.5`,
                index < rowData.length - 1
                  ? { borderBottomWidth: 1, borderBottomColor: colors.border }
                  : {}
              )}
            >
              <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>
                {row.label}
              </Text>
              <Text
                style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View
          style={tw.style(
            `flex-row justify-between items-center px-4 py-4 rounded-2xl border`,
            {
              backgroundColor: "#FFF4F0",
              borderColor: "#F0653A25",
            }
          )}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
            Total Amount
          </Text>
          <Text style={{ color: "#F0653A", fontSize: 18, fontWeight: "800" }}>
            ৳ {totalAmountNum}
          </Text>
        </View>
        {/* Checkout button */}
        <View
          style={tw.style(` pt-3 `, {
            borderTopColor: colors.border,
          })}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGoToCheckout}
            style={tw`h-14 bg-[#F0653A] rounded-2xl items-center justify-center shadow-sm`}
          >
            <Text style={tw`text-white text-base font-bold`}>
              Go to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
