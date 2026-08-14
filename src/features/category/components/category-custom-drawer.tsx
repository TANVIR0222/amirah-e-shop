import React, { useState } from "react"
import {
  View,
  Text,
  Pressable,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import tw from "twrnc"
import { router, useNavigation } from "expo-router"
import { DrawerActions } from "expo-router/react-navigation"
import type { DrawerContentComponentProps } from "@react-navigation/drawer"
import useCategoryAndChildren, {
  CategoryWithChildren,
} from "../hoock/use-category-and-children"
import { CategoryResponse } from "@/features/home/types/home-api-type"
import { Image } from "expo-image"

const BRAND_COLOR = "#F0653A"
const FALLBACK_IMAGE =
  "https://amiraheshop.com/images/product/202607170221361.jpeg"

const getImageUri = (image?: string | null) => {
  if (!image) return FALLBACK_IMAGE
  return image
}

// Android LayoutAnimation enable
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export type ChildCategory = CategoryResponse
export type Category = CategoryWithChildren

export interface CategoryDrawerProps {
  categories?: Category[]
  onCategoryPress?: (category: Category | ChildCategory) => void
  [key: string]: any
}

const CategoryCustomDrawer = ({
  categories: propCategories,
  onCategoryPress,
}: CategoryDrawerProps) => {
  const navigation = useNavigation()
  const { categoryData, isLoading } = useCategoryAndChildren()
  const categories = propCategories || categoryData

  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleToggle = (category: Category) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedId((prev) => (prev === category.id ? null : category.id))
  }

  const handleItemPress = (category: Category | ChildCategory) => {
    if (onCategoryPress) {
      onCategoryPress(category)
    } else {
      router.push({
        pathname: "/category",
        params: { id: String(category.id), name: category.name },
      })
      navigation.dispatch(DrawerActions.closeDrawer())
    }
  }

  const renderCategory = ({ item }: { item: Category }) => {
    const hasChildren = Boolean(item.children && item.children.length > 0)
    const isExpanded = expandedId === item.id
    const imageUri = getImageUri(item.image)

    return (
      <View style={tw`mb-2`}>
        {/* Parent Category */}
        <Pressable
          onPress={() => {
            if (hasChildren) {
              handleToggle(item)
            } else {
              handleItemPress(item)
            }
          }}
          style={({ pressed }) =>
            tw.style(
              "flex-row items-center justify-between px-4 py-3.5 rounded-xl",
              pressed && "bg-gray-100",
              isExpanded && "bg-[#FFF4F0]"
            )
          }
        >
          <View style={tw`flex-row items-center flex-1`}>
            {/* Image / Icon */}
            <View
              style={tw`w-10 h-10 rounded-xl bg-[#FFF0EC] items-center justify-center mr-3 overflow-hidden`}
            >
              <Image
                source={{ uri: imageUri }}
                style={tw`w-full h-full`}
                contentFit="cover"
                transition={150}
                cachePolicy="memory-disk"
              />
            </View>

            {/* Name */}
            <Text
              numberOfLines={1}
              style={tw.style(
                "flex-1 text-[15px] font-semibold",
                isExpanded ? "text-[#F0653A]" : "text-gray-800"
              )}
            >
              {item.name}
            </Text>
          </View>

          {/* Dropdown Icon */}
          {hasChildren && (
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={19}
              color={isExpanded ? BRAND_COLOR : "#6B7280"}
            />
          )}
        </Pressable>

        {/* Children */}
        {isExpanded && hasChildren && (
          <View style={tw`ml-7 mt-1 pl-5 border-l border-orange-100`}>
            {item.children?.map((child) => (
              <Pressable
                key={child.id}
                onPress={() => handleItemPress(child)}
                style={({ pressed }) =>
                  tw.style(
                    "flex-row items-center py-3 px-3 rounded-lg",
                    pressed && "bg-[#FFF4F0]"
                  )
                }
              >
                <View style={tw`w-2 h-2 rounded-full bg-[#F0653A] mr-3`} />

                <Text style={tw`text-[14px] text-gray-600 font-medium flex-1`}>
                  {child?.name}
                </Text>

                <Ionicons name="chevron-forward" size={15} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-5 pt-12 pb-4 border-b border-gray-100`}>
        <Text style={tw`text-xl font-bold text-gray-900`}>Categories</Text>
        <Text style={tw`text-xs text-gray-500 mt-1`}>
          Browse products by category
        </Text>
      </View>

      {/* Categories List */}
      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="small" color={BRAND_COLOR} />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`p-4 pb-8`}
          ItemSeparatorComponent={() => <View style={tw`h-[1px] bg-gray-50`} />}
        />
      )}
    </View>
  )
}

export default CategoryCustomDrawer
