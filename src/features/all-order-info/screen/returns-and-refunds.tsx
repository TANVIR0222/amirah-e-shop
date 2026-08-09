import { TopHeaderBar } from "@/components/ui/top-header-bar"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"

type ReturnStatus = "Pending" | "Refunded" | "Rejected"

type ReturnItem = {
  id: string
  orderId: string
  date: string
  reason: string
  amount: number
  status: ReturnStatus
  productName: string
  image: string
  refundMethod: string
}

const MOCK_RETURNS: ReturnItem[] = [
  {
    id: "RET-8801",
    orderId: "ORD-0982",
    date: "18 Jul 2026",
    reason: "Damaged packaging / Quality issue",
    amount: 140,
    status: "Refunded",
    productName: "Broccoli Organic (500g)",
    image: "https://amiraheshop.com/images/product/202607171216481.jpeg",
    refundMethod: "bKash Mobile Wallet",
  },
  {
    id: "RET-8802",
    orderId: "ORD-1004",
    date: "17 Jul 2026",
    reason: "Wrong item delivered",
    amount: 38,
    status: "Pending",
    productName: "Carrot Fresh (500 Gm)",
    image: "https://amiraheshop.com/images/product/202607170221361.jpeg",
    refundMethod: "Original Payment Method",
  },
]

const STATUS_CONFIG: Record<
  ReturnStatus,
  { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  Refunded: { color: "#22C55E", bg: "#F0FDF4", icon: "checkmark-circle" },
  Pending: { color: "#F59E0B", bg: "#FFFBEB", icon: "time" },
  Rejected: { color: "#EF4444", bg: "#FEF2F2", icon: "close-circle" },
}

const TABS = ["All", "Pending", "Refunded", "Rejected"] as const

function StatusBadge({ status }: { status: ReturnStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <View
      style={[
        tw`flex-row items-center gap-1 px-2.5 py-1 rounded-lg`,
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

function ReturnCard({ item }: { item: ReturnItem }) {
  const { colors } = useAppTheme()

  return (
    <View
      style={tw.style(`rounded-3xl border p-4 mb-3`, {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      })}
    >
      <View
        style={tw.style(
          `flex-row justify-between items-center pb-2.5 border-b mb-3`,
          {
            borderBottomColor: colors.border,
          }
        )}
      >
        {" "}
        <Text
          style={tw.style(`text-xs font-semibold`, {
            color: colors.mutedForeground,
          })}
        >
          Return #{item.id} · Order {item.orderId}
        </Text>
        <StatusBadge status={item.status} />
      </View>

      <View style={tw`flex-row items-center gap-3`}>
        <Image
          source={{ uri: item.image }}
          style={tw.style(`w-14 h-14 rounded-2xl`, {
            backgroundColor: colors.background,
          })}
          resizeMode="cover"
        />

        <View style={tw`flex-1`}>
          <Text
            numberOfLines={1}
            style={tw.style(`text-sm font-semibold`, { color: colors.text })}
          >
            {item.productName}
          </Text>
          <Text
            style={tw.style(`text-xs mt-0.5`, {
              color: colors.mutedForeground,
            })}
          >
            Reason: {item.reason}
          </Text>
          <Text
            style={tw.style(`text-xs mt-0.5`, {
              color: colors.mutedForeground,
            })}
          >
            Method: {item.refundMethod}
          </Text>
        </View>

        <View style={tw`items-end`}>
          <Text style={tw`text-sm font-bold text-[#F0653A]`}>
            ৳{item.amount}
          </Text>
          <Text
            style={tw.style(`text-[10px] mt-1`, {
              color: colors.mutedForeground,
            })}
          >
            {item.date}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default function ReturnsAndRefundsScreen() {
  const { colors } = useAppTheme()
  const [activeTab, setActiveTab] = useState<string>("All")

  const filtered =
    activeTab === "All"
      ? MOCK_RETURNS
      : MOCK_RETURNS.filter((r) => r.status === activeTab)

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* Top Header */}
      <TopHeaderBar
        title="Returns & Refunds"
        subtitle="Track your return requests"
      />

      <ScrollView
        contentContainerStyle={tw`p-4 pb-24`}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View
          style={tw.style(`rounded-2xl p-4 mb-4 flex-row items-center gap-3`, {
            backgroundColor: "#FDECEA",
            borderWidth: 1,
            borderColor: "#F0653A" + "30",
          })}
        >
          <View
            style={tw`w-10 h-10 rounded-full bg-[#F0653A] items-center justify-center`}
          >
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold text-[#F0653A]`}>
              7-Day Hassle-Free Returns
            </Text>
            <Text style={tw`text-xs text-[#A81E04] mt-0.5`}>
              Received a damaged or incorrect item? Request a return within 7
              days for a 100% refund.
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={tw`flex-row gap-2 mb-4`}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  tw`flex-1 py-2 rounded-full items-center border`,
                  {
                    backgroundColor: isActive ? "#F0653A" : colors.surface,
                    borderColor: isActive ? "#F0653A" : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: isActive ? "#fff" : colors.mutedForeground,
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Returns List */}
        {filtered.length > 0 ? (
          filtered.map((item) => <ReturnCard key={item.id} item={item} />)
        ) : (
          <View style={tw`items-center justify-center py-16`}>
            <Ionicons
              name="refresh-circle-outline"
              size={56}
              color={colors.mutedForeground}
            />
            <Text
              style={tw.style(`text-base font-semibold mt-3`, {
                color: colors.text,
              })}
            >
              No return requests found
            </Text>
            <Text
              style={tw.style(`text-xs mt-1`, {
                color: colors.mutedForeground,
              })}
            >
              Your return history will appear here
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View
        style={tw.style(
          `absolute bottom-5 left-4 right-4 p-2 rounded-2xl shadow-lg`,
          {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }
        )}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={tw`h-13 rounded-xl bg-[#F0653A] flex-row items-center justify-center gap-2`}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={tw`text-white font-bold text-sm`}>
            Request New Return
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
