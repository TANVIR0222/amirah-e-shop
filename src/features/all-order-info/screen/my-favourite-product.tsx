import { AppText } from "@/components/ui/app-text"
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CARD_MARGIN = 12
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_MARGIN) / 2

type Product = (typeof PRODUCTS)[number]

function FavouriteCard({
  item,
  onRemove,
}: {
  item: Product
  onRemove: (id: string) => void
}) {
  const { colors } = useAppTheme()
  const [qty, setQty] = useState(1)

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push("/product/[id]")}
      style={tw.style(`rounded-2xl overflow-hidden border mb-3`, {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderColor: colors.border,
      })}
    >
      {/* Image container + heart badge */}
      <View
        style={tw.style(`relative`, { backgroundColor: colors.background })}
      >
        <Image
          source={{ uri: item.image }}
          resizeMode="contain"
          style={tw`w-full h-36`}
        />

        {/* Remove from wishlist heart */}
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={tw.style(`absolute top-2 right-2 z-10 rounded-full p-1.5`, {
            backgroundColor: colors.surface + "CC",
          })}
        >
          <Ionicons name="heart" size={18} color="#F0653A" />
        </TouchableOpacity>
      </View>

      {/* Card body */}
      <View style={tw`p-3`}>
        <Text
          numberOfLines={2}
          style={tw.style(`text-xs font-semibold leading-4`, {
            color: colors.text,
          })}
        >
          {item.name}
        </Text>

        <View style={tw`flex-row items-center justify-between mt-1.5`}>
          <Text style={tw`text-base font-extrabold text-[#F0653A]`}>
            ৳{item.price}
          </Text>
          <View
            style={tw`flex-row items-center gap-1 bg-[#FFF8E1] px-1.5 py-0.5 rounded-md`}
          >
            <Ionicons name="star" size={12} color="#FFB300" />
            <Text style={tw`text-[11px] font-bold text-[#FFB300]`}>4.8</Text>
          </View>
        </View>

        {/* Stepper + Add to Cart */}
        <View style={tw`flex-row items-center mt-2.5 gap-2`}>
          <View
            style={tw.style(
              `flex-row items-center flex-1 h-9 rounded-xl border justify-around`,
              { borderColor: colors.border }
            )}
          >
            <TouchableOpacity
              onPress={() => qty > 1 && setQty(qty - 1)}
              hitSlop={4}
            >
              <Ionicons name="remove-outline" size={14} color={colors.text} />
            </TouchableOpacity>

            <Text style={tw.style(`text-xs font-bold`, { color: colors.text })}>
              {qty}
            </Text>

            <TouchableOpacity onPress={() => setQty(qty + 1)} hitSlop={4}>
              <Ionicons name="add-outline" size={14} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw.style(`w-9 h-9 rounded-xl items-center justify-center`, {
              backgroundColor: "#F0653A",
            })}
          >
            <Ionicons name="bag-handle-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function MyFavouriteProductScreen() {
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()
  const [items, setItems] = useState<Product[]>(PRODUCTS)
  const [search, setSearch] = useState("")

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* Top Header */}
      <View
        style={tw.style(`px-4 pb-3 flex-row items-center gap-3 `, {
          paddingTop: top + 10,
          backgroundColor: colors.surface,
        })}
      >
        <View style={tw`flex-1`}>
          <AppText variant="title"> My Fovourite </AppText>
        </View>

        {items.length > 0 && (
          <TouchableOpacity
            onPress={() => setItems([])}
            hitSlop={6}
            style={tw`px-3 py-1.5 rounded-full bg-[#FEF2F2]`}
          >
            <Text style={tw`text-xs font-bold text-[#EF4444]`}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      {items.length > 0 && (
        <View style={tw`px-4 pt-3 pb-2`}>
          <View
            style={tw.style(
              `flex-row items-center rounded-xl border px-3 h-10 gap-2`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.mutedForeground}
            />
            <TextInput
              style={tw.style(`flex-1 text-sm h-10`, { color: colors.text })}
              placeholder="Search in favourites..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} hitSlop={6}>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Favorites Product Grid */}
      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`p-4 pb-8`}
        columnWrapperStyle={tw`justify-between`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FavouriteCard item={item} onRemove={handleRemove} />
        )}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-24`}>
            <View
              style={tw`w-20 h-20 rounded-full bg-[#FDECEA] items-center justify-center mb-4`}
            >
              <Ionicons
                name="heart-dislike-outline"
                size={38}
                color="#F0653A"
              />
            </View>
            <Text style={tw.style(`text-lg font-bold`, { color: colors.text })}>
              No Favourite Products
            </Text>
            <Text
              style={tw.style(`text-xs mt-1 text-center px-8`, {
                color: colors.mutedForeground,
              })}
            >
              Tap the heart icon on any product to save it to your favourites
              list for quick shopping.
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(drawer)/(tabs)/shop")}
              style={tw`mt-6 px-6 py-3 rounded-full bg-[#F0653A]`}
            >
              <Text style={tw`text-white font-bold text-sm`}>Explore Shop</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}
