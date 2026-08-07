import { cartStorage } from "@/lib/storage/cart-storage"
import { useFavorites } from "@/lib/storage/favorite-storage"
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
  const { isFavorite, toggleFavorite } = useFavorites()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const imageUri =
    (Array.isArray(item?.image) ? item.image[0] : item?.image) ||
    item?.category?.image ||
    "https://amiraheshop.com/images/product/202607170221361.jpeg"

  if (!item) return null

  const isLiked = isFavorite(item.id)

  const handleToggleHeart = async (e: any) => {
    e?.stopPropagation?.()
    await toggleFavorite({
      id: item.id,
      name: item.name,
      category: item.category?.name || "General",
      price: Number(item.price) || 0,
      originalPrice: item.wholesale_price
        ? Number(item.wholesale_price)
        : undefined,
      image: item.images_array?.[0] || item.image,
      rating: 4.8,
      unit: item.unit || "1 Unit",
      inStock: item.in_stock === 1,
    })
  }

  const handleQuickAdd = async (e: any) => {
    e?.stopPropagation?.()
    await cartStorage.addToCart(
      {
        id: item.id,
        name: item.name,
        category: item.category?.name || "General",
        price: Number(item.price) || 0,
        originalPrice: item.wholesale_price
          ? Number(item.wholesale_price)
          : undefined,
        image: item.images_array?.[0] || item.image,
        inStock: item.in_stock === 1,
      },
      qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/product/[id]",
          params: { id: item.id },
        })
      }
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
          source={{
            uri: imageUri,
          }}
          contentFit="cover"
          transition={200}
          style={tw`w-full h-40`}
        />

        {/* Heart button — on top of image */}
        <TouchableOpacity
          onPress={handleToggleHeart}
          style={tw.style(`absolute top-2 right-2 z-10 rounded-full p-1.5`, {
            backgroundColor: isLiked ? "#FEF2F2" : colors.surface + "CC",
          })}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={18}
            color={isLiked ? "#E53E3E" : colors.mutedForeground}
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
            activeOpacity={0.8}
            onPress={handleQuickAdd}
            style={tw.style(`w-9 h-9 rounded-xl items-center justify-center`, {
              backgroundColor: added ? "#16A34A" : colors.danger,
            })}
          >
            <Ionicons
              name={added ? "checkmark" : "bag-handle-outline"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}
