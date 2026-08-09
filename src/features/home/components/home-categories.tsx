import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import { router } from "expo-router"
import React, { memo, useCallback, useMemo, useState } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { useGetCategoriesQuery } from "../api/home-api"
import { CategoryResponse } from "../types/home-api-type"
import CategoryCardSkeleton from "./skeleton/category-skeleton"

const MAX_CATEGORIES = 10
const BRAND_COLOR = "#F0653A"
const CARD_WIDTH = 110
const FALLBACK_IMAGE =
  "https://amiraheshop.com/images/product/202607170221361.jpeg"

// ─── CategoryCard Component ─────────────────────────────────────────────────

const CategoryCard = memo(
  ({
    item,
    isActive,
    onPress,
  }: {
    item: CategoryResponse
    isActive: boolean
    onPress: () => void
  }) => {
    const { colors } = useAppTheme()

    const imageUri = item?.image
      ? item.image.startsWith("http")
        ? item.image
        : `https://amiraheshop.com/${item.image.replace(/^\//, "")}`
      : FALLBACK_IMAGE

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={tw.style(
          `rounded-2xl h-36 overflow-hidden border mr-3 shadow-xs`,
          {
            width: CARD_WIDTH,
            backgroundColor: colors.surface,
            borderColor: isActive ? BRAND_COLOR : colors.border,
            borderWidth: isActive ? 2 : 1,
          }
        )}
      >
        <View
          style={tw.style(
            `w-full h-24 items-center justify-center overflow-hidden relative`,
            {
              backgroundColor: colors.background,
            }
          )}
        >
          <Image
            source={{ uri: imageUri }}
            style={tw`w-full h-full`}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
            placeholder={FALLBACK_IMAGE}
          />
          {isActive && (
            <View
              style={tw`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#F0653A]`}
            />
          )}
        </View>

        <View style={tw`p-2 items-center justify-center flex-1`}>
          <Text
            numberOfLines={1}
            style={tw.style(`text-xs font-bold text-center leading-4`, {
              color: isActive ? BRAND_COLOR : colors.text,
            })}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.isActive === next.isActive &&
    prev.item.name === next.item.name &&
    prev.item.image === next.item.image
)

CategoryCard.displayName = "CategoryCard"

// ─── View All Categories Card ───────────────────────────────────────────────

function ViewAllCard() {
  const { colors } = useAppTheme()

  return (
    <TouchableOpacity
      onPress={() => router.push("/category/all-category")}
      activeOpacity={0.75}
      style={tw.style(
        `rounded-2xl h-36 overflow-hidden border mr-3 shadow-xs`,
        {
          width: CARD_WIDTH,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }
      )}
    >
      <View
        style={tw.style(
          `w-full h-24 items-center justify-center overflow-hidden`,
          {
            backgroundColor: "#FEF2F2",
          }
        )}
      >
        <View
          style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-xs`}
        >
          <Ionicons name="arrow-forward" size={20} color={BRAND_COLOR} />
        </View>
      </View>

      <View style={tw`p-2 items-center justify-center flex-1`}>
        <Text
          numberOfLines={1}
          style={tw.style(`text-xs font-bold text-center leading-4`, {
            color: BRAND_COLOR,
          })}
        >
          View All
        </Text>
      </View>
    </TouchableOpacity>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function HomeCategories() {
  const [activeId, setActiveId] = useState<number | null>(null)

  // ── Fetch Categories ──────────────────────────────────────────────────────
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

  const handleCategoryPress = useCallback((item: CategoryResponse) => {
    setActiveId(item.id)
    router.push({
      pathname: "/category",
      params: { id: String(item.id), name: item.name },
    })
  }, [])

  return isLoading ? (
    <CategoryCardSkeleton cardWidth={CARD_WIDTH} />
  ) : (
    <FlatList
      horizontal
      data={displayedCategories}
      keyExtractor={(item) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
      onRefresh={refetch}
      refreshing={isFetching}
      renderItem={({ item }) => (
        <CategoryCard
          item={item}
          isActive={activeId === item.id}
          onPress={() => handleCategoryPress(item)}
        />
      )}
      ListFooterComponent={showViewAll ? <ViewAllCard /> : null}
    />
  )
}
