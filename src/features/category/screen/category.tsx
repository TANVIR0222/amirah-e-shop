import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import { PRODUCTS, homeCategory } from "@/utils/ui-data"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SIDEBAR_WIDTH = 84
const GRID_CONTAINER_WIDTH = SCREEN_WIDTH - SIDEBAR_WIDTH - 24 // 24 = margins
const CARD_WIDTH = (GRID_CONTAINER_WIDTH - 10) / 2

type Product = (typeof PRODUCTS)[number]

const SUBCATEGORIES = ["All", "Popular", "Organic", "New In", "Offers"]

function CategoryProductCard({ item }: { item: Product }) {
  const { colors } = useAppTheme()
  const [qty, setQty] = useState(1)
  const [liked, setLiked] = useState(item.favorite)

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push("/product/[id]")}
      style={tw.style(`rounded-2xl overflow-hidden border mb-2.5`, {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderColor: colors.border,
      })}
    >
      {/* Image container + heart */}
      <View
        style={tw.style(`relative`, { backgroundColor: colors.background })}
      >
        <Image
          source={{
            uri: "https://amiraheshop.com/images/product/202607170221361.jpeg",
          }}
          resizeMode="contain"
          style={tw`w-full h-32`}
        />

        <TouchableOpacity
          onPress={() => setLiked((v) => !v)}
          style={tw.style(`absolute top-2 right-2 z-10 rounded-full p-1.5`, {
            backgroundColor: colors.surface + "CC",
          })}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={16}
            color={liked ? "#F0653A" : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={tw`p-2.5`}>
        <Text
          numberOfLines={2}
          style={tw.style(`text-xs font-semibold leading-4`, {
            color: colors.text,
          })}
        >
          {item.name}
        </Text>

        <Text style={tw`text-sm font-extrabold text-[#F0653A] mt-1`}>
          ৳{item.price}
        </Text>

        {/* Stepper + Add */}
        <View style={tw`flex-row items-center mt-2 gap-1.5`}>
          <View
            style={tw.style(
              `flex-row items-center flex-1 h-8 rounded-lg border justify-around`,
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
            style={tw.style(`w-8 h-8 rounded-lg items-center justify-center`, {
              backgroundColor: "#F0653A",
            })}
          >
            <Ionicons name="bag-handle-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>()
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()

  const initialCatId = params.id
    ? Number(params.id)
    : (homeCategory[0]?.id ?? 1)
  const [selectedCatId, setSelectedCatId] = useState<number>(initialCatId)
  const [selectedSubCat, setSelectedSubCat] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const activeCategoryObj =
    homeCategory.find((c) => c.id === selectedCatId) || homeCategory[0]

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* ── Top Header ── */}
      <View
        style={tw.style(`px-4 pb-3 flex-row items-center gap-2 border-b`, {
          paddingTop: top + 10,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        })}
      >
        {/* <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={8}
          style={tw`w-9 h-9 rounded-full items-center justify-center bg-gray-100 dark:bg-zinc-800`}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity> */}

        {/* Search input */}
        <View
          style={tw.style(
            `flex-1 flex-row items-center rounded-xl px-3 h-10 gap-2 border`,
            {
              backgroundColor: colors.background,
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
            placeholder={`Search in ${activeCategoryObj?.titile || "Categories"}...`}
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={6}>
              <Ionicons
                name="close-circle"
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter button */}
        <TouchableOpacity
          onPress={() => router.push("/(modal)/order-filter-modal")}
          style={tw`w-10 h-10 rounded-xl items-center justify-center bg-[#F0653A]`}
        >
          <Ionicons name="options-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Main Section: Left Sidebar + Right Product Grid ── */}
      <View style={tw`flex-1 flex-row`}>
        {/* Left Category Sidebar */}
        <View
          style={tw.style(`w-[84px] border-r py-2`, {
            backgroundColor: colors.surface,
            borderRightColor: colors.border,
          })}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {homeCategory.map((cat) => {
              const isSelected = cat.id === selectedCatId
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setSelectedCatId(cat.id)
                    setSelectedSubCat("All")
                  }}
                  activeOpacity={0.7}
                  style={tw.style(`items-center py-3 px-1 relative`, {
                    backgroundColor: isSelected ? "#FDECEA" : "transparent",
                  })}
                >
                  {/* Selected left indicator bar */}
                  {isSelected && (
                    <View
                      style={tw`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#F0653A]`}
                    />
                  )}

                  {/* Icon / Image container */}
                  <View
                    style={tw.style(
                      `w-12 h-12 rounded-xl overflow-hidden mb-1 justify-center items-center`,
                      {
                        borderWidth: isSelected ? 2 : 1,
                        borderColor: isSelected ? "#F0653A" : colors.border,
                        backgroundColor: colors.background,
                      }
                    )}
                  >
                    <Image
                      source={cat.image}
                      style={tw`w-full h-full`}
                      resizeMode="cover"
                    />
                  </View>

                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 10,
                      fontWeight: isSelected ? "700" : "500",
                      color: isSelected ? "#F0653A" : colors.mutedForeground,
                      textAlign: "center",
                      lineHeight: 13,
                    }}
                  >
                    {cat.titile}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Right Content Area */}
        <View style={tw`flex-1 px-3 pt-3`}>
          {/* Subcategory Pills Header */}
          <View style={tw`mb-3`}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`gap-2 pr-2`}
            >
              {SUBCATEGORIES.map((sub) => {
                const isActive = sub === selectedSubCat
                return (
                  <TouchableOpacity
                    key={sub}
                    onPress={() => setSelectedSubCat(sub)}
                    style={tw.style(`px-3.5 py-1.5 rounded-full border`, {
                      backgroundColor: isActive ? "#F0653A" : colors.surface,
                      borderColor: isActive ? "#F0653A" : colors.border,
                    })}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: isActive ? "#FFFFFF" : colors.text,
                      }}
                    >
                      {sub}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>

          {/* Banner inside category */}
          <View
            style={tw.style(
              `rounded-2xl p-3 mb-3 flex-row items-center justify-between overflow-hidden`,
              {
                backgroundColor: "#F0653A",
              }
            )}
          >
            <View style={tw`flex-1 pr-2`}>
              <Text style={tw`text-white font-bold text-base`}>
                {activeCategoryObj?.titile || "Category"}
              </Text>
              <Text style={tw`text-red-100 text-xs mt-0.5`}>
                {PRODUCTS.length * 3}+ Products Available
              </Text>
            </View>
            <View style={tw`bg-white/20 px-2.5 py-1 rounded-lg`}>
              <Text style={tw`text-white text-xs font-extrabold`}>
                Up to 40% OFF
              </Text>
            </View>
          </View>

          {/* Product Grid */}
          <FlatList
            data={PRODUCTS}
            numColumns={2}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={tw`justify-between`}
            contentContainerStyle={tw`pb-20`}
            renderItem={({ item }) => <CategoryProductCard item={item} />}
          />
        </View>
      </View>
    </View>
  )
}
