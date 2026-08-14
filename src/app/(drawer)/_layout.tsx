import { CustomDrawerContent } from "@/components/navigation/custom-drawer-content"
import { useAppTheme } from "@/theme/theme-provider"
import { Drawer } from "expo-router/drawer"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const BRAND_ORANGE = "#F0653A"

export default function DrawerLayout() {
  const { colors } = useAppTheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
          name="(tabs)"
          options={{
            title: "Home",
            drawerLabel: "Home",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
