import { TopHeaderBar } from "@/components/ui/top-header-bar"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useMemo, useState } from "react"
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

type DeliveryFilter = "All" | "This Month" | "Express"

type DeliveryItem = {
  id: string
  deliveryDate: string
  deliveryTime: string
  address: string
  addressLabel: "Home" | "Work" | "Other"
  riderName: string
  riderPhone: string
  deliveryType: "Express 24h" | "Standard Delivery"
  totalAmount: number
  paymentMethod: "bKash" | "Cash on Delivery" | "Card"
  itemsCount: number
  productSummary: string
  productImage: string
  deliveryStatus: "Delivered"
  rating?: number
}

const MOCK_DELIVERIES: DeliveryItem[] = [
  {
    id: "DEL-88421",
    deliveryDate: "22 Jul 2026",
    deliveryTime: "04:15 PM",
    address: "House 45, Road 11, Block D, Banani, Dhaka",
    addressLabel: "Home",
    riderName: "Md. Tanvir Alam",
    riderPhone: "+8801700000001",
    deliveryType: "Express 24h",
    totalAmount: 520,
    paymentMethod: "bKash",
    itemsCount: 3,
    productSummary: "Fresh Organic Eggs (12 pcs) + 2 items",
    productImage: "https://amiraheshop.com/images/product/202607170221361.jpeg",
    deliveryStatus: "Delivered",
    rating: 5,
  },
  {
    id: "DEL-87109",
    deliveryDate: "18 Jul 2026",
    deliveryTime: "11:30 AM",
    address: "Level 4, Plot 12, Gulshan Avenue, Dhaka",
    addressLabel: "Work",
    riderName: "Karim Rahman",
    riderPhone: "+8801800000002",
    deliveryType: "Standard Delivery",
    totalAmount: 1250,
    paymentMethod: "Cash on Delivery",
    itemsCount: 5,
    productSummary: "Premium Basmati Rice 5kg + 4 items",
    productImage:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
    deliveryStatus: "Delivered",
    rating: 5,
  },
  {
    id: "DEL-85940",
    deliveryDate: "10 Jul 2026",
    deliveryTime: "06:45 PM",
    address: "House 45, Road 11, Block D, Banani, Dhaka",
    addressLabel: "Home",
    riderName: "Abul Hasan",
    riderPhone: "+8801900000003",
    deliveryType: "Express 24h",
    totalAmount: 340,
    paymentMethod: "bKash",
    itemsCount: 2,
    productSummary: "Fresh Red Tomatoes 1kg, Green Chili 250g",
    productImage: "https://amiraheshop.com/images/product/202607170959351.jpg",
    deliveryStatus: "Delivered",
    rating: 4,
  },
  {
    id: "DEL-83210",
    deliveryDate: "28 Jun 2026",
    deliveryTime: "02:10 PM",
    address: "House 45, Road 11, Block D, Banani, Dhaka",
    addressLabel: "Home",
    riderName: "Rafiqul Islam",
    riderPhone: "+8801600000004",
    deliveryType: "Standard Delivery",
    totalAmount: 890,
    paymentMethod: "Card",
    itemsCount: 4,
    productSummary: "Sunflower Cooking Oil 2L + 3 items",
    productImage: "https://amiraheshop.com/images/product/202607171216481.jpeg",
    deliveryStatus: "Delivered",
    rating: 5,
  },
]

export default function DeliveryHistoryScreen() {
  const { colors } = useAppTheme()

  const [activeFilter, setActiveFilter] = useState<DeliveryFilter>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDeliveries = useMemo(() => {
    return MOCK_DELIVERIES.filter((item) => {
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        const matchesId = item.id.toLowerCase().includes(q)
        const matchesProduct = item.productSummary.toLowerCase().includes(q)
        const matchesRider = item.riderName.toLowerCase().includes(q)
        if (!matchesId && !matchesProduct && !matchesRider) return false
      }
      if (activeFilter === "This Month") {
        return item.deliveryDate.includes("Jul 2026")
      }
      if (activeFilter === "Express") {
        return item.deliveryType === "Express 24h"
      }
      return true
    })
  }, [searchQuery, activeFilter])

  return (
    <View style={tw.style("flex-1", { backgroundColor: colors.background })}>
      {/* Top Header Bar */}
      <TopHeaderBar
        title="Delivery History"
        subtitle={`${MOCK_DELIVERIES.length} completed deliveries`}
        rightComponent={
          <View
            style={tw.style(
              "px-2.5 py-1 rounded-full flex-row items-center gap-1.5",
              { backgroundColor: "#F0FDF4" }
            )}
          >
            <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
            <Text style={tw`text-[11px] font-bold text-green-700`}>
              100% On-Time
            </Text>
          </View>
        }
      />

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={tw`p-4 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Stats Overview Card */}
        <View
          style={tw.style(
            "p-4 rounded-2xl mb-4 border flex-row justify-between items-center",
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          )}
        >
          <View style={tw`items-center flex-1`}>
            <View
              style={tw`w-9 h-9 rounded-full bg-green-100 items-center justify-center mb-1`}
            >
              <Ionicons name="checkmark-done" size={18} color="#16A34A" />
            </View>
            <Text
              style={tw.style("text-base font-bold", { color: colors.text })}
            >
              {MOCK_DELIVERIES.length}
            </Text>
            <Text
              style={tw.style("text-[11px]", { color: colors.mutedForeground })}
            >
              Total Delivered
            </Text>
          </View>

          <View
            style={tw.style("w-[1px] h-8 bg-gray-200", {
              backgroundColor: colors.border,
            })}
          />

          <View style={tw`items-center flex-1`}>
            <View
              style={tw`w-9 h-9 rounded-full bg-amber-100 items-center justify-center mb-1`}
            >
              <Ionicons name="flash" size={18} color="#D97706" />
            </View>
            <Text
              style={tw.style("text-base font-bold", { color: colors.text })}
            >
              24h
            </Text>
            <Text
              style={tw.style("text-[11px]", { color: colors.mutedForeground })}
            >
              Avg Speed
            </Text>
          </View>

          <View
            style={tw.style("w-[1px] h-8 bg-gray-200", {
              backgroundColor: colors.border,
            })}
          />

          <View style={tw`items-center flex-1`}>
            <View
              style={tw`w-9 h-9 rounded-full bg-red-100 items-center justify-center mb-1`}
            >
              <Ionicons name="star" size={18} color="#F0653A" />
            </View>
            <Text
              style={tw.style("text-base font-bold", { color: colors.text })}
            >
              4.9 ★
            </Text>
            <Text
              style={tw.style("text-[11px]", { color: colors.mutedForeground })}
            >
              Rating
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={tw.style(
            "flex-row items-center px-3.5 py-2.5 rounded-xl border mb-3 gap-2",
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          )}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.mutedForeground}
          />
          <TextInput
            placeholder="Search by Delivery ID or product..."
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={tw.style("flex-1 text-sm p-0", { color: colors.text })}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={tw`flex-row gap-2 mb-4`}>
          {(["All", "This Month", "Express"] as DeliveryFilter[]).map(
            (filter) => {
              const isActive = activeFilter === filter
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={tw.style(
                    "px-3.5 py-1.5 rounded-full border flex-row items-center gap-1",
                    isActive
                      ? { backgroundColor: "#F0653A", borderColor: "#F0653A" }
                      : {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        }
                  )}
                >
                  <Text
                    style={tw.style(
                      "text-xs font-semibold",
                      isActive ? "text-white" : { color: colors.text }
                    )}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              )
            }
          )}
        </View>

        {/* Deliveries List */}
        {filteredDeliveries.length === 0 ? (
          <View style={tw`items-center justify-center py-12 px-4`}>
            <View
              style={tw`w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3`}
            >
              <Ionicons
                name="cube-outline"
                size={32}
                color={colors.mutedForeground}
              />
            </View>
            <Text
              style={tw.style("text-base font-bold mb-1", {
                color: colors.text,
              })}
            >
              No deliveries found
            </Text>
            <Text
              style={tw.style("text-xs text-center", {
                color: colors.mutedForeground,
              })}
            >
              We couldn&apos;t find any delivery matching &quot;{searchQuery}
              &quot;
            </Text>
          </View>
        ) : (
          filteredDeliveries.map((item) => (
            <DeliveryCard key={item.id} item={item} />
          ))
        )}
      </ScrollView>
    </View>
  )
}

function DeliveryCard({ item }: { item: DeliveryItem }) {
  const { colors } = useAppTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <View
      style={tw.style("rounded-2xl border mb-3 overflow-hidden", {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      })}
    >
      {/* Top Banner */}
      <View
        style={tw.style(
          "px-4 py-3 border-b flex-row justify-between items-center",
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          }
        )}
      >
        <View style={tw`flex-row items-center gap-2`}>
          <View style={tw`w-2 h-2 rounded-full bg-green-500`} />
          <Text style={tw.style("text-xs font-bold", { color: colors.text })}>
            {item.id}
          </Text>
          <Text
            style={tw.style("text-[11px]", { color: colors.mutedForeground })}
          >
            • {item.deliveryDate}
          </Text>
        </View>

        <View
          style={tw.style(
            "px-2 py-0.5 rounded-full flex-row items-center gap-1",
            {
              backgroundColor: "#F0FDF4",
            }
          )}
        >
          <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
          <Text style={tw`text-[10px] font-bold text-green-700`}>
            {item.deliveryStatus}
          </Text>
        </View>
      </View>

      {/* Card Content */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
        style={tw`p-4`}
      >
        <View style={tw`flex-row items-start gap-3`}>
          <Image
            source={{ uri: item.productImage }}
            style={tw`w-14 h-14 rounded-xl bg-gray-100`}
            resizeMode="cover"
          />

          <View style={tw`flex-1`}>
            <Text
              style={tw.style("text-sm font-bold mb-1", { color: colors.text })}
              numberOfLines={1}
            >
              {item.productSummary}
            </Text>

            <View style={tw`flex-row items-center gap-1 mb-1.5`}>
              <Ionicons
                name="time-outline"
                size={13}
                color={colors.mutedForeground}
              />
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Delivered at {item.deliveryTime}
              </Text>
            </View>

            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw.style("text-sm font-bold text-red-600")}>
                ৳ {item.totalAmount}
              </Text>

              <View style={tw`flex-row items-center gap-1`}>
                <Ionicons
                  name={
                    item.deliveryType.includes("Express") ? "flash" : "bicycle"
                  }
                  size={12}
                  color="#F0653A"
                />
                <Text style={tw.style("text-[11px] font-medium text-red-600")}>
                  {item.deliveryType}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address summary */}
        <View
          style={tw.style(
            "mt-3 pt-2.5 border-t flex-row items-center justify-between",
            { borderTopColor: colors.border }
          )}
        >
          <View style={tw`flex-row items-center gap-1.5 flex-1 pr-2`}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.mutedForeground}
            />
            <Text
              style={tw.style("text-xs flex-1", {
                color: colors.mutedForeground,
              })}
              numberOfLines={1}
            >
              {item.addressLabel}: {item.address}
            </Text>
          </View>

          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.mutedForeground}
          />
        </View>

        {/* Expanded Details Panel */}
        {expanded && (
          <View
            style={tw.style("mt-3 pt-3 border-t gap-2.5", {
              borderTopColor: colors.border,
            })}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Rider Info
              </Text>
              <Text
                style={tw.style("text-xs font-semibold", {
                  color: colors.text,
                })}
              >
                {item.riderName} ({item.riderPhone})
              </Text>
            </View>

            <View style={tw`flex-row justify-between items-center`}>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Payment Method
              </Text>
              <Text
                style={tw.style("text-xs font-semibold", {
                  color: colors.text,
                })}
              >
                {item.paymentMethod}
              </Text>
            </View>

            <View style={tw`flex-row justify-between items-center`}>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Total Items
              </Text>
              <Text
                style={tw.style("text-xs font-semibold", {
                  color: colors.text,
                })}
              >
                {item.itemsCount} items
              </Text>
            </View>

            {/* Rating Stars */}
            <View style={tw`flex-row justify-between items-center pt-1`}>
              <Text
                style={tw.style("text-xs font-medium", { color: colors.text })}
              >
                Your Delivery Rating:
              </Text>
              <View style={tw`flex-row gap-0.5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={14}
                    color={star <= (item.rating ?? 5) ? "#F59E0B" : "#D1D5DB"}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}
