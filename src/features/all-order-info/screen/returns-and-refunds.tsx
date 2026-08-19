import { TopHeaderBar } from "@/components/ui/top-header-bar"
import {
  useLazyReturnRequestListByUserQuery,
  useReturnRequestListByUserQuery,
} from "@/features/order/api/order-api"
import { ReturnResponse } from "@/features/order/type/order-type"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useCallback, useMemo, useState } from "react"
import {
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

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

const STATUS_CONFIG: Record<
  ReturnStatus,
  { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  Refunded: { color: "#22C55E", bg: "#F0FDF4", icon: "checkmark-circle" },
  Pending: { color: "#F59E0B", bg: "#FFFBEB", icon: "time" },
  Rejected: { color: "#EF4444", bg: "#FEF2F2", icon: "close-circle" },
}

function StatusBadge({ status }: { status: ReturnStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <View style={tw`flex-row items-center gap-1 px-2.5 py-1 rounded-lg`}>
      <Ionicons name={cfg.icon} size={13} color={cfg.color} />
      <Text style={{ fontSize: 11, fontWeight: "700" }}>{status}</Text>
    </View>
  )
}

function ReturnCard({ item }: { item: any }) {
  const { colors } = useAppTheme()

  return (
    <View style={tw.style(`rounded-3xl border p-4 mb-3`)}>
      <View
        style={tw.style(
          `flex-row items-center justify-between border-b pb-3 mb-3`,
          { borderColor: colors.border }
        )}
      >
        <Text
          numberOfLines={1}
          style={tw.style(`text-xs font-semibold flex-1 mr-2`, {
            color: colors.mutedForeground,
          })}
        >
          Return #{item.reference_no} · Order {item.order_ref}
        </Text>
        <StatusBadge status={item.status || "Pending"} />
      </View>

      <View style={tw`flex-row items-center gap-3`}>
        <Image
          source={{ uri: item.items?.[0]?.image }}
          style={tw.style(`w-14 h-14 rounded-2xl`)}
          resizeMode="cover"
        />

        <View style={tw`flex-1`}>
          <Text numberOfLines={1} style={tw.style(`text-sm font-semibold`)}>
            {item.items?.[0]?.name || "Product"}
          </Text>
          <Text
            style={tw.style(`text-xs mt-0.5`, {
              color: colors.mutedForeground,
            })}
          >
            Reason: {item.reason}
          </Text>
        </View>

        <View style={tw`items-end`}>
          <Text style={tw`text-sm font-bold text-[#F0653A]`}>
            ৳{item.grand_total}
          </Text>
          <Text
            style={tw.style(`text-[10px] mt-1`, {
              color: colors.mutedForeground,
            })}
          >
            {item.created_at?.split(" ")[0]}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default function ReturnsAndRefundsScreen() {
  const { colors } = useAppTheme()

  // Extra pages fetched beyond page 1
  const [extraItems, setExtraItems] = useState<ReturnResponse[]>([])
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Synchronously reset extra pagination items during render when search changes

  // ── Page 1: RTK Query auto-fetches ────────────────────────────────────────
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useReturnRequestListByUserQuery({ page: 1 })

  // ── Lazy query for pages 2+ ───────────────────────────────────────────────
  const [fetchMore] = useLazyReturnRequestListByUserQuery()

  // ── Derive page-1 items & pagination meta ─────────────────────────────────
  const page1Items = useMemo(() => page1Data?.data?.data ?? [], [page1Data])
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

    fetchMore({ page: nextPage, per_page: 10 })
      .unwrap()
      .then((res) => {
        const pagination = res?.data
        if (pagination?.data) {
          setExtraItems((prev) => [...prev, ...pagination.data])
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
  }, [loadingMore, effectiveHasMore, isLoading, fetchMore, nextPage])

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
    <View style={tw`flex-1`}>
      {/* Top Header */}
      <TopHeaderBar
        title="Returns & Refunds"
        subtitle="Track your return requests"
      />

      <FlatList
        data={allItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`p-4 pb-24`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ReturnCard item={item} />}

        ListEmptyComponent={
          !isLoading ? (
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
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={tw`py-4 items-center`}>
              <ActivityIndicator size="small" color="#F0653A" />
            </View>
          ) : null
        }
      />
    </View>
  )
}
