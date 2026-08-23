import { Screen } from "@/components/ui/screen"
import { useUserLogoutMutation } from "@/features/auth/api/auth-api"
import { useSession } from "@/features/auth/auth-session"
import useOrder from "@/features/checkout/hook/user-order"
import useAuthUserInfo from "@/hooks/use-auth-user-info"
import { useCart } from "@/lib/storage/cart-storage"
import { useFavorites } from "@/lib/storage/favorite-storage"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import { router } from "expo-router"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useUserProfileQuery } from "../api/profile-api"

const BRAND_ORANGE = "#F0653A"

type IoniconName = keyof typeof Ionicons.glyphMap

type MenuRow = {
  icon: IoniconName
  label: string
  sublabel?: string
  onPress?: () => void
  danger?: boolean
}

function StatCard({
  icon,
  label,
  value,
  color = BRAND_ORANGE,
  bgColor,
  onPress,
}: {
  icon: IoniconName
  label: string
  value: string | number
  color?: string
  bgColor?: string
  onPress?: () => void
}) {
  const { colors } = useAppTheme()
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={tw.style(
        `flex-1 items-center py-4 px-2 rounded-2xl border shadow-xs`,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }
      )}
    >
      {/* Icon Circle */}
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: bgColor || `${color}15`,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>

      {/* Value Counter */}
      <Text
        style={{
          fontSize: 19,
          fontWeight: "800",
          color: colors.text,
        }}
      >
        {value}
      </Text>

      {/* Label */}
      <Text
        numberOfLines={1}
        style={{
          fontSize: 11,
          fontWeight: "600",
          color: colors.mutedForeground,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

function MenuSection({
  title,
  rows,
  isGuest,
}: {
  title: string
  rows: MenuRow[]
  isGuest: boolean
}) {
  const { colors } = useAppTheme()

  return (
    <View style={tw`mb-4`}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: colors.mutedForeground,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 8,
          paddingHorizontal: 4,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          overflow: "hidden",
        }}
      >
        {rows.map((row, i) => (
          <TouchableOpacity
            key={row.label}
            onPress={
              isGuest &&
              (title === "My Account" || row.label === "Edit Profile")
                ? () => router.push("/(auth)/login")
                : row.onPress
            }
            activeOpacity={0.65}
            style={[
              tw`flex-row items-center px-4 py-3.5`,
              i < rows.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          >
            {/* Icon bubble */}
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: row.danger ? "#E53E3E18" : `${BRAND_ORANGE}15`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name={row.icon}
                size={18}
                color={row.danger ? "#E53E3E" : BRAND_ORANGE}
              />
            </View>

            <View style={tw`flex-1`}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: row.danger ? "#E53E3E" : colors.text,
                }}
              >
                {row.label}
              </Text>
              {row.sublabel ? (
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.mutedForeground,
                    marginTop: 1,
                  }}
                >
                  {row.sublabel}
                </Text>
              ) : null}
            </View>

            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default function ProfileScreen() {
  const { user, signOut } = useSession()
  const { colors } = useAppTheme()
  const { data } = useUserProfileQuery()
  const { favorites } = useFavorites()
  const { totalCount } = useCart()

  const { orderLenght, isLoading } = useOrder()
  const [userLogout, { isLoading: isLoggingOut }] = useUserLogoutMutation()
  const { name } = useAuthUserInfo()

  // console.log(orderData);

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
              console.warn("[Profile] Logout error:", error)
            } finally {
              signOut()
              router.replace("/(auth)/welcome")
            }
          },
        },
      ]
    )
  }

  const sections: { title: string; rows: MenuRow[] }[] = [
    {
      title: "My Account",
      rows: [
        {
          icon: "person-outline",
          label: "Edit Profile",
          onPress: () => router.push("/profile/edit-profile"),
        },
        {
          icon: "location-outline",
          label: "Saved Addresses",
          onPress: () => router.push("/profile/addresses"),
        },
        {
          icon: "key-outline",
          label: "Change Password",
          onPress: () => router.push("/profile/change-password"),
        },
      ],
    },
    {
      title: "Orders",
      rows: [
        {
          icon: "refresh-outline",
          label: "Returns",
          onPress: () => router.push("/(all-order-info)/returns-and-refunds"),
        },
        {
          icon: "heart-outline",
          label: "My Favourite Product",
          onPress: () => router.push("/(all-order-info)/my-favourite-product"),
        },
        {
          icon: "time-outline",
          label: "Delivery History",
          onPress: () => router.push("/(all-order-info)/delivery-history"),
        },
      ],
    },
    {
      title: "Preferences",
      rows: [
        {
          icon: "document-text-outline",
          label: "Terms & Conditions",
          onPress: () => router.push("/(all-order-info)/terms-and-conditions"),
        },
        {
          icon: "lock-closed-outline",
          label: "Privacy & Security",
          onPress: () => router.push("/(all-order-info)/privacy-and-security"),
        },
        {
          icon: "help-circle-outline",
          label: "Help & Support (FAQ)",
          onPress: () => router.push("/(all-order-info)/help-and-support"),
        },
        {
          icon: "information-circle-outline",
          label: "About",
          onPress: () => router.push("/(all-order-info)/about"),
        },
      ],
    },
  ]

  const isGuest =
    !user?.email ||
    user?.name === "Guest" ||
    data?.data?.name === "Guest" ||
    name === "Guest" ||
    !name

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Avatar + Info ── */}
        <View style={tw`items-center pt-4 pb-6`}>
          <Image
            source={{
              uri: data?.data?.image ?? undefined,
            }}
            style={tw`w-32 h-32 rounded-full`}
            contentFit="cover"
            placeholder={
              "https://img.magnific.com/free-vector/gradient-shopping-discount-horizontal-sale-banner_23-2150321996.jpg?t=st=1784568760~exp=1784572360~hmac=6b6585b9dbd3c120d4b802b8150ced1557b3c22d9981974accd0bffa5ba9df8d&w=2000"
            }
          />

          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>
            {data?.data?.name ?? user?.name ?? "Guest"}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.mutedForeground,
              marginTop: 3,
            }}
          >
            {data?.data?.email ?? user?.email ?? ""}
          </Text>
        </View>

        {/* ── Dynamic Stats Cards ── */}
        <View style={tw`flex-row gap-3 mb-6`}>
          <StatCard
            icon="bag-handle-outline"
            label="Orders"
            value={`${isLoading ? "0" : orderLenght}`}
            color="#3B82F6"
            bgColor="#EFF6FF"
            onPress={() => router.push("/(all-order-info)/my-orders")}
          />
          <StatCard
            icon="heart-outline"
            label="Favourite"
            value={favorites.length}
            color="#EF4444"
            bgColor="#FEF2F2"
            onPress={() =>
              router.push("/(all-order-info)/my-favourite-product")
            }
          />
          <StatCard
            icon="cart-outline"
            label="Cart"
            value={totalCount}
            color="#F0653A"
            bgColor="#FFF7ED"
            onPress={() => router.push("/cart")}
          />
        </View>

        {/* ── Menu Sections ── */}
        {sections.map((section) => (
          <MenuSection key={section.title} {...section} isGuest={isGuest} />
        ))}

        {/* ── Sign Out ── */}
        <TouchableOpacity
          onPress={handleSignOut}
          disabled={isLoggingOut}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
            marginBottom: 24,
            paddingVertical: 14,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: "#E53E3E40",
            backgroundColor: "#E53E3E0D",
            opacity: isLoggingOut ? 0.6 : 1,
          }}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#E53E3E" />
          ) : (
            <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
          )}
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#E53E3E",
            }}
          >
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  )
}
