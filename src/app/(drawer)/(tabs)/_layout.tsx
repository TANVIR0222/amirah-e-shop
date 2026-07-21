import { NativeTabs } from "expo-router/unstable-native-tabs"

import { useAppTheme } from "@/theme/theme-provider"

export default function TabsLayout() {
  const { colors } = useAppTheme()

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      indicatorColor={"#FDECEA"}
      labelStyle={{ color: colors.text }}
      rippleColor={colors.primarySoft}
      tintColor={colors.danger}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="shop">
        <NativeTabs.Trigger.Icon
          sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }}
          md="shopping_bag_speed"
        />
        <NativeTabs.Trigger.Label>Shop</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="order">
        <NativeTabs.Trigger.Icon
          sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }}
          md="shopping_cart"
        />
        <NativeTabs.Trigger.Label>Order</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md="person"
        />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
