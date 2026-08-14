import CategoryCustomDrawer from "@/features/category/components/category-custom-drawer"
import { useAppTheme } from "@/theme/theme-provider"
import { Drawer } from "expo-router/drawer"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const BRAND_ORANGE = "#F0653A"

export default function CategoryLayout() {
  const { colors } = useAppTheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CategoryCustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: colors.background,
            width: 280,
          },
          drawerActiveTintColor: BRAND_ORANGE,
          drawerInactiveTintColor: colors.mutedForeground,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Category",
            drawerLabel: "Category",
          }}
        />
        <Drawer.Screen
          name="all-category"
          options={{
            title: "All Categories",
            drawerLabel: "All Categories",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
