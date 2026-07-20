import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import { PRODUCTS } from "@/utils/ui-data"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

type Product = (typeof PRODUCTS)[number]

const GAP = 5
const HORIZONTAL_PADDING = 16

const SCREEN_WIDTH = Dimensions.get("window").width

const NUM_COLUMNS = SCREEN_WIDTH < 380 ? 1 : 2

const CARD_WIDTH =
  NUM_COLUMNS === 1
    ? SCREEN_WIDTH - HORIZONTAL_PADDING * 2
    : (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP) / 2

export default function HomeItemsCard() {
  const { colors } = useAppTheme()
  const [qty, setQty] = useState(1)

  function ProductCard({ item }: { item: Product }) {
    const [liked, setLiked] = useState(item.favorite)

    return (
      <TouchableOpacity
        onPress={() => router.push("/product/[id]")}
        style={tw.style(`rounded-2xl overflow-hidden border`, {
          width: CARD_WIDTH,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        })}
      >
        {/* ── Image container with heart overlay ── */}
        <View
          style={tw.style(`relative`, { backgroundColor: colors.background })}
        >
          <Image
            source={{ uri: item.image }}
            resizeMode="contain"
            style={tw`w-full h-40`}
          />

          {/* Heart button — on top of image */}
          <TouchableOpacity
            onPress={() => setLiked((v) => !v)}
            style={tw.style(`absolute top-2 right-2 z-10 rounded-full p-1.5`, {
              backgroundColor: colors.surface + "CC",
            })}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={18}
              color={liked ? "#E53E3E" : colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {/* ── Card body ── */}
        <View style={tw`px-3 pb-3 pt-2`}>
          {/* Name */}
          <Text
            numberOfLines={2}
            style={tw.style(`text-sm font-semibold leading-5`, {
              color: colors.text,
            })}
          >
            {item.name}
          </Text>

          {/* Price */}
          <Text style={tw`text-base font-extrabold text-[#08A44A] mt-1`}>
            ৳{item.price}
          </Text>

          {/* Qty stepper + Add to cart */}
          <View style={tw`flex-row items-center mt-2 gap-2`}>
            <View
              style={tw.style(
                `flex-row items-center flex-1 h-9 rounded-xl border justify-around`,
                { borderColor: colors.border }
              )}
            >
              <TouchableOpacity
                onPress={() => qty > 1 && setQty(qty - 1)}
                hitSlop={6}
              >
                <Ionicons name="remove-outline" size={16} color={colors.text} />
              </TouchableOpacity>

              <Text
                style={tw.style(`text-sm font-bold`, { color: colors.text })}
              >
                {qty}
              </Text>

              <TouchableOpacity onPress={() => setQty(qty + 1)} hitSlop={6}>
                <Ionicons name="add-outline" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={tw.style(
                `w-9 h-9 rounded-xl items-center justify-center`,
                {
                  backgroundColor: colors.primary,
                }
              )}
            >
              <Ionicons name="bag-handle-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={tw`flex-shrink`}>
      <FlatList
        data={PRODUCTS}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        columnWrapperStyle={
          NUM_COLUMNS > 1
            ? {
                gap: GAP,
              }
            : undefined
        }
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={tw`gap-3  pb-5`}
      />
    </View>
  )
}
