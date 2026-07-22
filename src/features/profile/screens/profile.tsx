import { Screen } from "@/components/ui/screen"
import { useSession } from "@/features/auth/auth-session"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

type IoniconName = keyof typeof Ionicons.glyphMap

type MenuRow = {
  icon: IoniconName
  label: string
  sublabel?: string
  onPress?: () => void
  danger?: boolean
}

const STATS = [
  { icon: "bag-handle" as IoniconName, label: "Orders", value: "12" },
  { icon: "heart" as IoniconName, label: "Wishlist", value: "5" },
  { icon: "star" as IoniconName, label: "Reviews", value: "8" },
]

function StatCard({
  icon,
  label,
  value,
}: {
  icon: IoniconName
  label: string
  value: string
}) {
  const { colors } = useAppTheme()
  return (
    <View
      style={[
        tw`flex-1 items-center py-4 rounded-2xl`,
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "800",
          color: colors.text,
          marginTop: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}
      >
        {label}
      </Text>
    </View>
  )
}

function MenuSection({ title, rows }: { title: string; rows: MenuRow[] }) {
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
            onPress={row.onPress}
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
                backgroundColor: row.danger
                  ? (colors.danger ?? "#E53E3E") + "18"
                  : colors.primary + "18",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name={row.icon}
                size={18}
                color={
                  row.danger ? (colors.danger ?? "#E53E3E") : colors.primary
                }
              />
            </View>

            <View style={tw`flex-1`}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: row.danger
                    ? (colors.danger ?? "#E53E3E")
                    : colors.text,
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  function handleSignOut() {
    signOut()
    router.replace("/(auth)/welcome")
  }

  const sections: { title: string; rows: MenuRow[] }[] = [
    {
      title: "My Account",
      rows: [
        { icon: "person-outline", label: "Edit Profile" },
        { icon: "location-outline", label: "Saved Addresses" },
        { icon: "card-outline", label: "Payment Methods" },
      ],
    },
    {
      title: "Orders",
      rows: [
        {
          icon: "bag-handle-outline",
          label: "My Orders",
          sublabel: "View all orders",
          onPress: () => router.push("/(all-order-info)/my-orders"),
        },
        {
          icon: "refresh-outline",
          label: "Returns & Refunds",
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

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Avatar + Info ── */}
        <View style={tw`items-center pt-4 pb-6`}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: colors.primary + "22",
              borderWidth: 3,
              borderColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Text
              style={{ fontSize: 30, fontWeight: "800", color: colors.primary }}
            >
              {initials}
            </Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>
            {user?.name ?? "Guest"}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.mutedForeground,
              marginTop: 3,
            }}
          >
            {user?.email ?? ""}
          </Text>

          <TouchableOpacity
            style={{
              marginTop: 12,
              paddingHorizontal: 18,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: colors.primary,
            }}
          >
            <Text
              style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ── */}
        <View style={tw`flex-row gap-3 mb-6`}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </View>

        {/* ── Menu Sections ── */}
        {sections.map((section) => (
          <MenuSection key={section.title} {...section} />
        ))}

        {/* ── Sign Out ── */}
        <TouchableOpacity
          onPress={handleSignOut}
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
            borderColor: (colors.danger ?? "#E53E3E") + "40",
            backgroundColor: (colors.danger ?? "#E53E3E") + "0D",
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.danger ?? "#E53E3E"}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.danger ?? "#E53E3E",
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  )
}
