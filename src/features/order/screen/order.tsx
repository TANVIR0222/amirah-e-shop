import { AppText } from "@/components/ui/app-text"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"

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

const TABS: OrderStatus[] = ["Processing", "Shipped", "Delivered", "Cancelled"]

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
  return (
    <View style={tw`bg-white rounded-3xl border border-[#E8E8E8] p-4 mb-3`}>
      <View style={tw`flex-row items-center gap-3`}>
        {/* Product image */}
        <Image
          source={{ uri: order.image }}
          style={tw`w-16 h-16 rounded-2xl bg-gray-100`}
          resizeMode="cover"
        />

        {/* Details */}
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between items-start`}>
            <Text style={tw`text-xs text-[#757575] font-inter-regular`}>
              {order.id}
            </Text>
            <StatusBadge status={order.status} />
          </View>

          <Text
            numberOfLines={1}
            style={tw`text-sm font-geist-semibold text-heading_black mt-1`}
          >
            {order.product}
          </Text>

          <View style={tw`flex-row items-center justify-between mt-2`}>
            <Text style={tw`text-xs text-[#757575]`}>
              {order.items} item{order.items > 1 ? "s" : ""} · {order.date}
            </Text>
            <Text style={tw`text-sm font-geist-bold text-[#F0653A]`}>
              ৳ {order.total}
            </Text>
          </View>
        </View>
      </View>

      {/* Action row */}
      <View style={tw`flex-row gap-2 mt-3 border-t border-gray-100 pt-3`}>
        {order.status === "Delivered" && (
          <TouchableOpacity
            style={tw`flex-1 h-9 rounded-full bg-[#FDECEA] items-center justify-center`}
          >
            <Text style={tw`text-xs font-semibold text-[#F0653A]`}>
              Buy Again
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
          style={tw`flex-1 h-9 rounded-full bg-[#F0653A] items-center justify-center`}
        >
          <Text style={tw`text-xs font-semibold text-white`}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("Processing")

  const filtered = MOCK_ORDERS.filter((o) => o.status === activeTab)

  return (
    <Screen>
      {/* Header */}

      <AppText variant="title"> My Orders</AppText>

      {/* Tabs */}
      <View style={tw`  pb-3`}>
        <View style={tw`flex-row gap-2 mt-3`}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            const cfg = STATUS_CONFIG[tab]
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  tw`flex-1 py-2 rounded-full  items-center`,
                  { backgroundColor: isActive ? cfg.color : "#fff" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: isActive ? "#fff" : "#757575",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Order List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw``}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-20`}>
            <Ionicons name="bag-handle-outline" size={56} color="#D1D5DB" />
            <Text style={tw`text-base text-[#9CA3AF] font-semibold mt-4`}>
              No {activeTab} orders
            </Text>
            <Text style={tw`text-sm text-[#9CA3AF] mt-1`}>
              Your {activeTab.toLowerCase()} orders will appear here
            </Text>
          </View>
        }
      />
    </Screen>
  )
}
