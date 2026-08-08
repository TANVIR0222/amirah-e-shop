import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useGetCategoriesQuery } from "../api/home-api"
import { CategoryResponse } from "../types/home-api-type"

const MAX_CATEGORIES = 10
const BRAND = "#F0653A"

// ─── CategoryCard Component ─────────────────────────────────────────────────

function CategoryCard({
  item,
  isActive,
  onPress,
}: {
  item: CategoryResponse
  isActive: boolean
  onPress: () => void
}) {
  const { colors } = useAppTheme()

  const imageUri = item?.image
    ? item.image.startsWith("http")
      ? item.image
      : `https://amiraheshop.com/${item.image.replace(/^\//, "")}`
    : "https://amiraheshop.com/images/product/202607170221361.jpeg"

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`items-center mr-4`}
      activeOpacity={0.7}
    >
      <View
        style={[
          tw`w-20 h-20 rounded-2xl overflow-hidden`,
          {
            borderWidth: 2,
            borderColor: isActive ? BRAND : "transparent",
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 3,
          },
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      </View>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 6,
          fontSize: 12,
          fontWeight: "600",
          color: isActive ? BRAND : colors.text,
          maxWidth: 72,
          textAlign: "center",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )
}

// ─── View All Categories Card ───────────────────────────────────────────────

function ViewAllCard() {
  const { colors } = useAppTheme()

  return (
    <TouchableOpacity
      onPress={() => router.push("/(all-order-info)/all-category")}
      style={tw`items-center mr-4`}
      activeOpacity={0.75}
    >
      <View
        style={[
          tw`w-20 h-20 rounded-2xl items-center justify-center border`,
          {
            backgroundColor: colors.surface,
            borderColor: BRAND,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 3,
          },
        ]}
      >
        <View
          style={tw`w-9 h-9 rounded-full bg-[#FEF2F2] items-center justify-center`}
        >
          <Ionicons name="arrow-forward" size={18} color={BRAND} />
        </View>
      </View>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 6,
          fontSize: 12,
          fontWeight: "700",
          color: BRAND,
          maxWidth: 72,
          textAlign: "center",
        }}
      >
        View All
      </Text>
    </TouchableOpacity>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function HomeCategories() {
  const [activeId, setActiveId] = useState<number | null>(null)

  // ── Fetch Categories (Fetch 15 to check if there are > 10 categories) ─────
  const {
    data: categoryData,
    isLoading,
    refetch,
    isFetching,
  } = useGetCategoriesQuery({ page: 1, per_page: 15 })

  const rawItems = useMemo(() => categoryData?.data?.data ?? [], [categoryData])
  const totalCount = categoryData?.data?.total ?? rawItems.length

  // Show max 10 categories on the home screen
  const displayedCategories = useMemo(
    () => rawItems.slice(0, MAX_CATEGORIES),
    [rawItems]
  )

  // Show "View All" card if total categories exceed 10
  const showViewAll =
    rawItems.length > MAX_CATEGORIES || totalCount > MAX_CATEGORIES

  const effectiveActiveId = activeId ?? displayedCategories[0]?.id ?? null

  const handleCategoryPress = useCallback((item: CategoryResponse) => {
    setActiveId(item.id)
    router.push({
      pathname: "/category",
      params: { id: String(item.id), name: item.name },
    })
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={tw`py-6 items-center`}>
        <ActivityIndicator color={BRAND} />
      </View>
    )
  }

  return (
    <FlatList
      horizontal
      data={displayedCategories}
      keyExtractor={(item) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
      onRefresh={refetch}
      refreshing={isFetching}
      renderItem={({ item }) => (
        <CategoryCard
          item={item}
          isActive={effectiveActiveId === item.id}
          onPress={() => handleCategoryPress(item)}
        />
      )}
      ListFooterComponent={showViewAll ? <ViewAllCard /> : null}
    />
  )
}
