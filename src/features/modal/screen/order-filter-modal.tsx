import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

const SORT_OPTIONS = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Most Popular",
]
const CATEGORIES = ["All", "Vegetables", "Fruits", "Spices", "Dairy", "Grains"]

export default function OrderFilterModal() {
  const { colors } = useAppTheme()
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0])
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      <View style={tw`px-5 pt-4 gap-5 pb-8`}>
        <View style={tw`items-center pb-1`}>
          <View
            style={tw.style(`w-10 h-1 rounded-full`, {
              backgroundColor: colors.border,
            })}
          />
        </View>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
            Filter & Sort
          </Text>
        </View>

        {/* Sort By */}
        <View style={tw`gap-3`}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: colors.mutedForeground,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Sort By
          </Text>
          <View style={tw`gap-2`}>
            {SORT_OPTIONS.map((opt) => {
              const active = opt === activeSort
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setActiveSort(opt)}
                  style={tw.style(
                    `flex-row items-center justify-between px-4 py-3 rounded-xl border`,
                    {
                      borderColor: active ? "#C52405" : colors.border,
                      backgroundColor: active ? "#FDECEA" : colors.surface,
                    }
                  )}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: active ? "#C52405" : colors.text,
                    }}
                  >
                    {opt}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#C52405"
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Category */}
        <View style={tw`gap-3`}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: colors.mutedForeground,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Category
          </Text>
          <View style={tw`flex-row flex-wrap gap-2`}>
            {CATEGORIES.map((cat) => {
              const active = cat === activeCategory
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={tw.style(`px-4 py-2 rounded-full border`, {
                    borderColor: active ? "#C52405" : colors.border,
                    backgroundColor: active ? "#C52405" : colors.surface,
                  })}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: active ? "#fff" : colors.text,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Apply button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw.style(`h-14 rounded-2xl items-center justify-center`, {
            backgroundColor: "#C52405",
          })}
        >
          <Text style={tw`text-white text-base font-bold`}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
