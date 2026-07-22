import Ionicons from "@expo/vector-icons/Ionicons"
import { router, usePathname } from "expo-router"
import { Drawer, DrawerContentScrollView, DrawerItem } from "expo-router/drawer"
import { Text, TouchableOpacity, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { useSession } from "@/features/auth/auth-session"
import { useAppTheme } from "@/theme/theme-provider"

type NavItem = {
  label: string
  route:
    | "/(drawer)/(tabs)"
    | "/(drawer)/(tabs)/shop"
    | "/(drawer)/(tabs)/order"
    | "/(drawer)/(tabs)/profile"
  icon: keyof typeof Ionicons.glyphMap
  activeIcon: keyof typeof Ionicons.glyphMap
  matchSegment: string
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    route: "/(drawer)/(tabs)",
    icon: "home-outline",
    activeIcon: "home",
    matchSegment: "index",
  },
  {
    label: "Shop",
    route: "/(drawer)/(tabs)/shop",
    icon: "storefront-outline",
    activeIcon: "storefront",
    matchSegment: "shop",
  },
  {
    label: "Order",
    route: "/(drawer)/(tabs)/order",
    icon: "bag-handle-outline",
    activeIcon: "bag-handle",
    matchSegment: "order",
  },
  {
    label: "Profile",
    route: "/(drawer)/(tabs)/profile",
    icon: "person-outline",
    activeIcon: "person",
    matchSegment: "profile",
  },
]

function CustomDrawerContent(props: any) {
  const { colors } = useAppTheme()
  const pathname = usePathname()
  const { user, signOut } = useSession()

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1 }}
      scrollEnabled={false}
    >
      {/* ── Header ── */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {/* App brand */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Ionicons name="bag" size={20} color="#fff" />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: colors.text,
              letterSpacing: -0.5,
            }}
          >
            Amirah Shop
          </Text>
        </View>

        {/* User profile */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primary + "22",
              borderWidth: 2,
              borderColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: 17, fontWeight: "700", color: colors.primary }}
            >
              {initials}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{ fontSize: 15, fontWeight: "700", color: colors.text }}
            >
              {user?.name ?? "Guest"}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: colors.mutedForeground,
                marginTop: 1,
              }}
            >
              {user?.email ?? ""}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Nav Items ── */}
      <View style={{ flex: 1, paddingTop: 12 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.matchSegment === "index"
              ? pathname === "/" ||
                pathname.endsWith("/index") ||
                pathname === pathname.replace(/\/[^/]+$/, "")
              : pathname.includes(item.matchSegment)

          return (
            <DrawerItem
              key={item.label}
              label={item.label}
              focused={isActive}
              activeTintColor={colors.primary}
              inactiveTintColor={colors.mutedForeground}
              activeBackgroundColor={colors.primarySoft}
              style={{
                borderRadius: 12,
                marginHorizontal: 8,
                marginVertical: 2,
              }}
              labelStyle={{
                fontWeight: isActive ? "700" : "400",
                fontSize: 15,
              }}
              icon={({ color }) => (
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={22}
                  color={color}
                />
              )}
              onPress={() => {
                router.push(item.route)
                props.navigation.closeDrawer()
              }}
            />
          )
        })}
      </View>

      {/* ── Footer: Sign Out ── */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            signOut()
            props.navigation.closeDrawer()
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: colors.danger + "12",
          }}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: colors.danger }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  )
}

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
          drawerActiveTintColor: colors.primary,
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
