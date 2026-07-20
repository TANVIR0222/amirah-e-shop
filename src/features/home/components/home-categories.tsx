import React, { useState } from "react"
import tw from "@/lib/tailwind"
import { homeCategory } from "@/utils/ui-data"
import { useAppTheme } from "@/theme/theme-provider"
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
            tw`w-16 h-16 rounded-2xl overflow-hidden`,
            {
              borderWidth: 2,
              borderColor: isActive ? colors.primary : "transparent",
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
            fontSize: 11,
            fontWeight: "500",
            color: isActive ? colors.primary : colors.mutedForeground,
            maxWidth: 64,
            textAlign: "center",
          }}
        >
          {item.titile}
        </Text>
      </TouchableOpacity>
    )
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
          onPress={() => setActiveId(item.id)}
        />
      )}
    />
  )
}
