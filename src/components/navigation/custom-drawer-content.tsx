import { useUserLogoutMutation } from "@/features/auth/api/auth-api"
import { useSession } from "@/features/auth/auth-session"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router, usePathname } from "expo-router"
import { DrawerContentScrollView, DrawerItem } from "expo-router/drawer"
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

const BRAND_ORANGE = "#F0653A"

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

export function CustomDrawerContent(props: any) {
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

  const [userLogout, { isLoading: isLoggingOut }] = useUserLogoutMutation()

  function handleSignOut() {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out from your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await userLogout().unwrap()
            } catch (error) {
              console.warn("[Drawer] Logout error:", error)
            } finally {
              signOut()
              props.navigation.closeDrawer()
              router.replace("/(auth)/welcome")
            }
          },
        },
      ]
    )
  }

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
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: BRAND_ORANGE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="bag-handle" size={18} color="#FFF" />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -0.5,
              }}
            >
              Amirah <Text style={{ color: BRAND_ORANGE }}>Shop</Text>
            </Text>
          </View>
        </View>

        {/* User profile card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push("/(drawer)/(tabs)/profile")
            props.navigation.closeDrawer()
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 10,
            borderRadius: 14,
            backgroundColor: `${BRAND_ORANGE}10`,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: `${BRAND_ORANGE}25`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: BRAND_ORANGE,
              }}
            >
              {initials}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.text,
              }}
            >
              {user?.name ?? "Guest User"}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                color: colors.mutedForeground,
                marginTop: 1,
              }}
            >
              {user?.email ?? "Tap to view profile"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      {/* ── Navigation Items ── */}
      <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 12 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.matchSegment === "index"
              ? pathname === "/" || pathname === "/(drawer)/(tabs)"
              : pathname.includes(item.matchSegment)

          return (
            <DrawerItem
              key={item.route}
              label={item.label}
              focused={isActive}
              activeTintColor={BRAND_ORANGE}
              inactiveTintColor={colors.text}
              activeBackgroundColor={`${BRAND_ORANGE}15`}
              style={{
                borderRadius: 12,
                marginVertical: 3,
                marginHorizontal: 0,
                paddingHorizontal: 8,
              }}
              labelStyle={{
                fontWeight: isActive ? "700" : "500",
                marginLeft: -8,
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
          onPress={handleSignOut}
          disabled={isLoggingOut}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#E53E3E12",
            opacity: isLoggingOut ? 0.6 : 1,
          }}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#E53E3E" />
          ) : (
            <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
          )}
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#E53E3E" }}>
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  )
}
