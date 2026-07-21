import tw from "@/lib/tailwind"
import Ionicons from "@expo/vector-icons/Ionicons"
import type { DrawerNavigationProp } from "@react-navigation/drawer"
import { router, useNavigation } from "expo-router"
import { Image, TouchableOpacity, View } from "react-native"

export default function HomeHeader() {
  const navigation =
    useNavigation<DrawerNavigationProp<Record<string, object | undefined>>>()

  return (
    <View style={tw` flex-row items-center justify-between`}>
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={28} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row gap-2 items-center`}>
        <TouchableOpacity
          onPress={() => router.push("/(drawer)/(tabs)/order")}
          style={tw``}
        >
          <Ionicons name="cart-outline" size={28} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={tw``}>
          <View
            style={tw`absolute right-0 top-0 w-2 h-2 rounded-full bg-red-500 z-10`}
          />
          <Ionicons name="notifications-outline" size={28} color="#666" />
        </TouchableOpacity>

        <Image
          source={{
            uri: "https://img.magnific.com/free-vector/gradient-shopping-discount-horizontal-sale-banner_23-2150321996.jpg?t=st=1784568760~exp=1784572360~hmac=6b6585b9dbd3c120d4b802b8150ced1557b3c22d9981974accd0bffa5ba9df8d&w=2000",
          }}
          style={tw`w-11 h-11 rounded-full`}
        />
      </View>
    </View>
  )
}
