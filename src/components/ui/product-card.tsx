import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"

const OUTER_PADDING = 24
const GAP = 12
const SCREEN_WIDTH = Dimensions.get("window").width
const NUM_COLUMNS = SCREEN_WIDTH < 380 ? 1 : 2
const CARD_WIDTH =
  NUM_COLUMNS === 1
    ? SCREEN_WIDTH - OUTER_PADDING * 2
    : (SCREEN_WIDTH - OUTER_PADDING * 2 - GAP) / 2

export function ProductCard({ item }: any) {
  const { colors } = useAppTheme()
  const [liked, setLiked] = useState(item?.favorite ?? false)
  const [qty, setQty] = useState(1)

  if (!item) return null

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/product/[id]",
          params: { id: item.id },
        })
      }
      style={tw.style(`rounded-2xl  overflow-hidden border`, {
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
          source={{
            uri:
              item?.image?.[0] ??
              "https://amiraheshop.com/images/product/202607170221361.jpeg",
          }}
          contentFit="cover"
          transition={200}
          style={tw`w-full h-40`}
        />

        {/* Heart button — on top of image */}
        <TouchableOpacity
          onPress={() => setLiked((v: any) => !v)}
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

            <Text style={tw.style(`text-sm font-bold`, { color: colors.text })}>
              {qty}
            </Text>

            <TouchableOpacity onPress={() => setQty(qty + 1)} hitSlop={6}>
              <Ionicons name="add-outline" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw.style(`w-9 h-9 rounded-xl items-center justify-center`, {
              backgroundColor: colors.danger,
            })}
          >
            <Ionicons name="bag-handle-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}
