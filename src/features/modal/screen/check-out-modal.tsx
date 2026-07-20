import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

const ROW_DATA = [
  { label: "Total Product", value: "3 Item(s)" },
  { label: "Weight", value: "4 kg" },
  { label: "Subtotal", value: "৳ 200" },
  { label: "Delivery Charge", value: "৳ 60" },
]

export default function CheckOutModal() {
  const { colors } = useAppTheme()

  return (
    <View style={tw.style(``, { backgroundColor: colors.background })}>
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
          {ROW_DATA.map((row, index) => (
            <View
              key={row.label}
              style={tw.style(
                `flex-row justify-between items-center px-4 py-3`,
                index < ROW_DATA.length - 1
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
            `flex-row justify-between items-center px-4 py-4 rounded-2xl`,
            {
              backgroundColor: colors.primary + "12",
            }
          )}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
            Total Amount
          </Text>
          <Text
            style={{ color: colors.primary, fontSize: 18, fontWeight: "800" }}
          >
            ৳ 260
          </Text>
        </View>
      </ScrollView>

      {/* Checkout button */}
      <View
        style={tw.style(`px-5 pb-10 pt-3 border-t`, {
          borderTopColor: colors.border,
        })}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={tw.style(`h-14 rounded-2xl items-center justify-center`, {
            backgroundColor: colors.primary,
          })}
        >
          <Text style={tw`text-white text-base font-bold`}>Go to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
