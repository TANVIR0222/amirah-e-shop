import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import { homeCategory } from "@/utils/ui-data"
import { router } from "expo-router"
import { useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"

type Category = (typeof homeCategory)[number]

export default function HomeCategories() {
  const [activeId, setActiveId] = useState<number>(homeCategory[0]?.id ?? 1)

  function CategoryCard({
    item,
    isActive,
    onPress,
  }: {
    item: Category
    isActive: boolean
    onPress: () => void
  }) {
    const { colors } = useAppTheme()

    return (
      <TouchableOpacity
        onPress={onPress}
        style={tw`items-center mr-4`}
        activeOpacity={0.7}
      >
        {/* Image card */}
        <View
          style={[
            tw`w-20 h-20 rounded-2xl overflow-hidden`,
            {
              borderWidth: 2,
              borderColor: isActive ? "#F0653A" : "transparent",
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
            source={item.image}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>

        {/* Title */}
        <Text
          numberOfLines={1}
          style={{
            marginTop: 6,
            fontSize: 12,
            fontWeight: "600",
            color: isActive ? "#F0653A" : colors.text,
            maxWidth: 72,
            textAlign: "center",
          }}
        >
          {item.titile}
        </Text>
      </TouchableOpacity>
    )
  }

  const handleCategoryPress = (category: Category) => {
    setActiveId(category.id)
    router.push({
      pathname: "/category",
      params: { id: String(category.id), name: category.titile },
    })
  }

  return (
    <FlatList
      horizontal
      data={homeCategory}
      keyExtractor={(item) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
      renderItem={({ item }) => (
        <CategoryCard
          item={item}
          isActive={activeId === item.id}
          onPress={() => handleCategoryPress(item)}
        />
      )}
    />
  )
}
