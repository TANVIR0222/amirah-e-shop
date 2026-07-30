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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function AddReviewModal() {
  const { colors } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [productRating, setProductRating] = useState<number>(5)
  const [riderRating, setRiderRating] = useState<number>(5)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmitReview = () => {
    setIsSubmitted(true)
    setTimeout(() => {
      router.back()
    }, 1200)
  }

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View
        style={tw.style(
          "px-4 pb-3 border-b border-gray-100 flex-row items-center justify-between",
          {
            paddingTop: Math.max(insets.top + 8, 16),
            backgroundColor: colors.background,
          }
        )}
      >
        <Text style={tw.style("text-lg font-bold", { color: colors.text })}>
          Write a Review
        </Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw.style("p-4 gap-4", {
          paddingBottom: Math.max(insets.bottom + 24, 32),
        })}
      >
        {/* Delivered Product Header */}
        <View
          style={tw.style(
            "p-3.5 rounded-2xl border flex-row gap-3 items-center",
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          )}
        >
          <Image
            source={{
              uri: "https://amiraheshop.com/images/product/202607170221361.jpeg",
            }}
            style={tw`w-14 h-14 rounded-xl bg-gray-100`}
            resizeMode="cover"
          />

          <View style={tw`flex-1 gap-0.5`}>
            <Text style={tw.style("text-xs font-bold", { color: colors.text })}>
              Fresh Organic Eggs (12 pcs)
            </Text>
            <Text
              style={tw.style("text-[11px]", { color: colors.mutedForeground })}
            >
              Delivered on 22 Jul 2026 • #ORD-2026-88421
            </Text>
          </View>
        </View>

        {/* Product Rating Stars */}
        <View
          style={tw.style("p-4 rounded-2xl border gap-2.5 items-center", {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          })}
        >
          <Text
            style={tw.style(
              "text-xs font-bold text-gray-500 uppercase tracking-wider"
            )}
          >
            Rate the Product Quality
          </Text>

          <View style={tw`flex-row gap-2 my-1`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setProductRating(star)}
                hitSlop={6}
              >
                <Ionicons
                  name={star <= productRating ? "star" : "star-outline"}
                  size={32}
                  color={star <= productRating ? "#D97706" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={tw`text-xs font-bold text-amber-700`}>
            {productRating === 5
              ? "Excellent! Highly recommended ⭐"
              : productRating === 4
                ? "Good quality 👍"
                : productRating === 3
                  ? "Average product 👌"
                  : productRating === 2
                    ? "Below expectation 👎"
                    : "Poor quality ❌"}
          </Text>
        </View>

        {/* Rider Rating Stars */}
        <View
          style={tw.style("p-4 rounded-2xl border gap-2.5 items-center", {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          })}
        >
          <Text
            style={tw.style(
              "text-xs font-bold text-gray-500 uppercase tracking-wider"
            )}
          >
            Rate the Delivery Rider (Md. Tanvir Alam)
          </Text>

          <View style={tw`flex-row gap-2 my-1`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRiderRating(star)}
                hitSlop={6}
              >
                <Ionicons
                  name={star <= riderRating ? "star" : "star-outline"}
                  size={28}
                  color={star <= riderRating ? "#16A34A" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Written Review TextInput */}
        <View style={tw`gap-1.5`}>
          <Text style={tw.style("text-xs font-bold", { color: colors.text })}>
            Your Feedback / Review Comments
          </Text>
          <TextInput
            style={tw.style("border rounded-2xl p-3.5 h-28 text-xs leading-5", {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.text,
            })}
            placeholder="Tell us about the product quality, packaging, and delivery speed..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            value={reviewText}
            onChangeText={setReviewText}
          />
        </View>

        {/* Photo Attachment Placeholder */}
        <View style={tw`gap-1.5`}>
          <Text style={tw.style("text-xs font-bold", { color: colors.text })}>
            Add Photos (Optional)
          </Text>

          <View style={tw`flex-row gap-2.5`}>
            <TouchableOpacity
              style={tw.style(
                "w-20 h-20 rounded-2xl border-2 border-dashed items-center justify-center gap-1",
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }
              )}
            >
              <Ionicons name="camera-outline" size={22} color="#9CA3AF" />
              <Text style={tw`text-[10px] font-bold text-gray-400`}>
                Add Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Review Button */}
        <TouchableOpacity
          onPress={handleSubmitReview}
          disabled={isSubmitted}
          style={tw.style(
            "mt-4 h-12 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm",
            isSubmitted ? "bg-green-600" : "bg-[#000]"
          )}
        >
          <Ionicons
            name={isSubmitted ? "checkmark-circle" : "send-outline"}
            size={18}
            color="#FFF"
          />
          <Text style={tw`text-sm font-bold text-white`}>
            {isSubmitted ? "Review Submitted!" : "Submit Review"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
