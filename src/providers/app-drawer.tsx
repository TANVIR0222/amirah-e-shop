import { Drawer } from "expo-router/drawer"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function DrawerNavigation() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "overview",
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "User",
            title: "overview",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
