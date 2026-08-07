import { AppText } from "@/components/ui/app-text"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled"

type Order = {
  id: string
  date: string
  items: number
  total: number
  status: OrderStatus
  image: string
  product: string
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    date: "21 Jul 2026",
    items: 2,
    total: 260,
    status: "Delivered",
    image: "https://amiraheshop.com/images/product/202607170221361.jpeg",
    product: "Potato Regular + 1 more",
  },
  {
    id: "ORD-1002",
    date: "20 Jul 2026",
    items: 1,
    total: 48,
    status: "Shipped",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
    product: "Fresh Tomato (500 Gm)",
  },
  {
    id: "ORD-1003",
    date: "19 Jul 2026",
    items: 3,
    total: 195,
    status: "Processing",
    image: "https://amiraheshop.com/images/product/202607170959351.jpg",
    product: "Onion Premium + 2 more",
  },
  {
    id: "ORD-1004",
    date: "17 Jul 2026",
    items: 1,
    total: 38,
    status: "Cancelled",
    image: "https://amiraheshop.com/images/product/202607171216481.jpeg",
    product: "Carrot Fresh (500 Gm)",
  },
]

const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  Delivered: { color: "#22C55E", bg: "#F0FDF4", icon: "checkmark-circle" },
  Shipped: { color: "#F0653A", bg: "#FDECEA", icon: "bicycle" },
  Processing: { color: "#F59E0B", bg: "#FFFBEB", icon: "time" },
  Cancelled: { color: "#EF4444", bg: "#FEF2F2", icon: "close-circle" },
}

const TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <View
      style={[
        tw`flex-row items-center gap-1 px-2 py-1 rounded-lg`,
        { backgroundColor: cfg.bg },
      ]}
    >
      <Ionicons name={cfg.icon} size={13} color={cfg.color} />
      <Text style={{ fontSize: 11, fontWeight: "700", color: cfg.color }}>
        {status}
      </Text>
    </View>
  )
}

function OrderCard({ order }: { order: Order }) {
  const { colors } = useAppTheme()

  return (
    <View
      style={tw.style(`rounded-3xl border p-4 mb-3`, {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      })}
    >
      <View style={tw`flex-row items-center gap-3`}>
        {/* Product image */}
        <Image
          source={
            typeof order?.image === "number"
              ? order.image
              : {
                  uri:
                    typeof order?.image === "string" &&
                    order.image.trim() !== ""
                      ? order.image
                      : "https://amiraheshop.com/images/product/202607170221361.jpeg",
                }
          }
          style={tw.style(`w-16 h-16 rounded-2xl`, {
            backgroundColor: colors.background,
          })}
          resizeMode="cover"
        />

        {/* Details */}
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between items-start`}>
            <Text
              style={tw.style(`text-xs`, { color: colors.mutedForeground })}
            >
              {order.id}
            </Text>
            <StatusBadge status={order.status} />
          </View>

          <Text
            numberOfLines={1}
            style={tw.style(`text-sm font-semibold mt-1`, {
              color: colors.text,
            })}
          >
            {order.product}
          </Text>

          <View style={tw`flex-row items-center justify-between mt-2`}>
            <Text
              style={tw.style(`text-xs`, { color: colors.mutedForeground })}
            >
              {order.items} item{order.items > 1 ? "s" : ""} · {order.date}
            </Text>
            <Text style={tw`text-sm font-bold text-[#F0653A]`}>
              ৳ {order.total}
            </Text>
          </View>
        </View>
      </View>

      {/* Action row */}
      <View
        style={tw.style(`flex-row gap-2 mt-3 border-t pt-3`, {
          borderTopColor: colors.border,
        })}
      >
        {order.status === "Delivered" && (
          <>
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              style={tw`flex-1 h-9 rounded-full bg-[#FDECEA] items-center justify-center`}
            >
              <Text style={tw`text-xs font-semibold text-[#F0653A]`}>
                Buy Again
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(modal)/add-review-modal")}
              style={tw`flex-1 h-9 rounded-full bg-amber-50 border border-amber-200 items-center justify-center`}
            >
              <Text style={tw`text-xs font-semibold text-amber-800`}>
                Write Review
              </Text>
            </TouchableOpacity>
          </>
        )}
        {order.status === "Shipped" && (
          <TouchableOpacity
            onPress={() => router.push("/checkout/order-tracking")}
            style={tw`flex-1 h-9 rounded-full bg-[#FEF2F2] border border-red-200 items-center justify-center`}
          >
            <Text style={tw`text-xs font-semibold text-[#F0653A]`}>
              Track Live
            </Text>
          </TouchableOpacity>
        )}
        {order.status === "Processing" && (
          <TouchableOpacity
            style={tw`flex-1 h-9 rounded-full bg-[#FEF2F2] items-center justify-center`}
          >
            <Text style={tw`text-xs font-semibold text-[#EF4444]`}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.push("/checkout/order-tracking")}
          style={tw`flex-1 h-9 rounded-full bg-[#F0653A] items-center justify-center`}
        >
          <Text style={tw`text-xs font-semibold text-white`}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function MyOrdersScreen() {
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()
  const [activeTab, setActiveTab] = useState<string>("All")

  const filtered =
    activeTab === "All"
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter((o) => o.status === activeTab)

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* Top Bar with Back Button */}

      <View
        style={tw.style(`px-4 pb-3 flex-row items-center gap-3 `, {
          paddingTop: top + 10,
          backgroundColor: colors.surface,
        })}
      >
        <AppText variant="title"> My Fovourite </AppText>
      </View>

      {/* Tabs */}
      <View
        style={tw.style(`px-4 py-3 border-b`, {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        })}
      >
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TABS as unknown as string[]}
          keyExtractor={(item) => item}
          contentContainerStyle={tw`gap-2`}
          renderItem={({ item }) => {
            const isActive = item === activeTab
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(item)}
                style={[
                  tw`px-4 py-2 rounded-full items-center`,
                  { backgroundColor: isActive ? "#F0653A" : colors.background },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: isActive ? "#fff" : colors.mutedForeground,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      {/* Order List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`p-4 pb-8`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-20`}>
            <Ionicons
              name="bag-handle-outline"
              size={56}
              color={colors.mutedForeground}
            />
            <Text
              style={tw.style(`text-base font-semibold mt-4`, {
                color: colors.text,
              })}
            >
              No {activeTab.toLowerCase()} orders
            </Text>
            <Text
              style={tw.style(`text-sm mt-1`, {
                color: colors.mutedForeground,
              })}
            >
              Your orders will appear here
            </Text>
          </View>
        }
      />
    </View>
  )
}
