import { AppText } from "@/components/ui/app-text"
import { Screen } from "@/components/ui/screen"
import { TopHeaderBar } from "@/components/ui/top-header-bar"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import {
  useGetAllInfoOrderQuery,
  useLazyGetAllInfoOrderQuery,
} from "../api/order-api"
import { Order } from "../type/order-type"

type OrderStatus =
  "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Pending"

type Orders = {
  id: string
  date: string
  items: number
  total: number
  status: OrderStatus
  image: string
  product: string
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  Delivered: { color: "#22C55E", bg: "#F0FDF4", icon: "checkmark-circle" },
  Shipped: { color: "#F0653A", bg: "#FDECEA", icon: "bicycle" },
  Processing: { color: "#F59E0B", bg: "#FFFBEB", icon: "time" },
  Cancelled: { color: "#EF4444", bg: "#FEF2F2", icon: "close-circle" },
  Pending: { color: "#6366F1", bg: "#EEF2FF", icon: "hourglass" },
}

const TABS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const

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
          source={{
            uri: order?.items?.[0]?.image?.trim()
              ? order.items[0].image
              : "https://amiraheshop.com/images/product/202607170221361.jpeg",
          }}
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
              {order?.reference_no}
            </Text>
            <StatusBadge
              status={(order?.sale_status ?? "Pending") as OrderStatus}
            />
          </View>

          <Text
            numberOfLines={1}
            style={tw.style(`text-sm font-semibold mt-1`, {
              color: colors.text,
            })}
          >
            {order?.items?.[0]?.name ?? "—"}
          </Text>

          <View style={tw`flex-row items-center justify-between mt-2`}>
            <Text
              style={tw.style(`text-xs`, { color: colors.mutedForeground })}
            >
              {order?.total_items} item{order?.total_items > 1 ? "s" : ""} ·{" "}
              {order?.date}
            </Text>
            <Text style={tw`text-sm font-bold text-[#F0653A]`}>
              ৳ {order?.grand_total}
            </Text>
          </View>
        </View>
      </View>

      {/* Action row — uses lowercase comparison so API casing never matters */}
      {(() => {
        const s = order?.sale_status?.toLowerCase() ?? ""
        return (
          <View
            style={tw.style(`flex-row gap-2 mt-3 border-t pt-3`, {
              borderTopColor: colors.border,
            })}
          >
            {/* ── Delivered: Buy Again + Write Review ── */}
            {s === "delivered" && (
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

            {/* ── Shipped: Track Live ── */}
            {s === "shipped" && (
              <TouchableOpacity
                onPress={() => router.push("/checkout/order-tracking")}
                style={tw`flex-1 h-9 rounded-full bg-[#FDECEA] border border-[#F0653A] items-center justify-center`}
              >
                <Text style={tw`text-xs font-semibold text-[#F0653A]`}>
                  Track Live
                </Text>
              </TouchableOpacity>
            )}

            {/* ── Processing: Cancel Order ── */}
            {s === "processing" && (
              <TouchableOpacity
                style={tw`flex-1 h-9 rounded-full bg-[#FEF2F2] items-center justify-center`}
              >
                <Text style={tw`text-xs font-semibold text-[#EF4444]`}>
                  Cancel Order
                </Text>
              </TouchableOpacity>
            )}

            {/* ── Pending: Cancel Order ── */}
            {s === "pending" && (
              <TouchableOpacity
                style={tw`flex-1 h-9 rounded-full bg-[#FEF2F2] items-center justify-center`}
              >
                <Text style={tw`text-xs font-semibold text-[#EF4444]`}>
                  Cancel Order
                </Text>
              </TouchableOpacity>
            )}

            {/* ── Cancelled: Reorder ── */}
            {s === "cancelled" && (
              <TouchableOpacity
                onPress={() => router.push("/cart")}
                style={tw`flex-1 h-9 rounded-full bg-[#FDECEA] items-center justify-center`}
              >
                <Text style={tw`text-xs font-semibold text-[#F0653A]`}>
                  Reorder
                </Text>
              </TouchableOpacity>
            )}

            {/* ── Track Order: only for active orders ── */}
            {(s === "shipped" || s === "processing" || s === "pending") && (
              <TouchableOpacity
                onPress={() => router.push("/checkout/order-tracking")}
                style={tw`flex-1 h-9 rounded-full bg-[#F0653A] items-center justify-center`}
              >
                <Text style={tw`text-xs font-semibold text-white`}>
                  Track Order
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )
      })()}
    </View>
  )
}

export default function MyOrdersScreen() {
  const { colors } = useAppTheme()
  const [activeTab, setActiveTab] = useState<string>("All")

  // Extra pages fetched beyond page 1
  const [extraItems, setExtraItems] = useState<Order[]>([])
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Synchronously reset extra pagination items during render when search changes
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab)
  if (prevActiveTab !== activeTab) {
    setPrevActiveTab(activeTab)
    setExtraItems([])
    setNextPage(2)
    setHasMore(true)
  }

  // ── Page 1: RTK Query auto-fetches ────────────────────────────────────────
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useGetAllInfoOrderQuery({
    page: 1,
    per_page: 10,
    status: activeTab.toLocaleLowerCase(),
  })

  // ── Lazy query for pages 2+ ───────────────────────────────────────────────
  const [fetchMore] = useLazyGetAllInfoOrderQuery()

  // ── Derive page-1 items & pagination meta ─────────────────────────────────
  const page1Items = useMemo(() => page1Data?.data?.orders ?? [], [page1Data])
  const page1Meta = useMemo(() => page1Data?.data, [page1Data])

  const effectiveHasMore =
    extraItems.length === 0
      ? page1Meta
        ? page1Meta.current_page < page1Meta.last_page
        : false
      : hasMore

  const allItems = useMemo(
    () => [...page1Items, ...extraItems],
    [page1Items, extraItems]
  )

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !effectiveHasMore || isLoading) return
    setLoadingMore(true)

    fetchMore({
      page: nextPage,
      per_page: 10,
      status: activeTab.toLocaleLowerCase(),
    })
      .unwrap()
      .then((res) => {
        const pagination = res.data
        if (pagination?.orders) {
          setExtraItems((prev) => [...prev, ...pagination.orders])
          setHasMore(pagination.current_page < pagination.last_page)
          setNextPage(pagination.current_page + 1)
        }
      })
      .catch((err) => {
        if (__DEV__) console.warn("[Shop] Load more error:", err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }, [loadingMore, effectiveHasMore, isLoading, fetchMore, nextPage, activeTab])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setExtraItems([])
    setNextPage(2)
    setHasMore(true)

    refetch().finally(() => {
      setRefreshing(false)
    })
  }, [refetch])

  return (
    <Screen>
      {/* Top Header Bar */}
      <AppText variant="title"> My Orders</AppText>

      {/* Tabs */}
      <View
        style={tw.style(` py-3 border-b`, {
          // backgroundColor: colors.surface,
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
        data={allItems}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={tw` pb-8`}
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
    </Screen>
  )
}
