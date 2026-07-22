import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useMemo, useState } from "react"
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type NotificationCategory = "All" | "Orders" | "Promos" | "System"

type NotificationItem = {
  id: string
  title: string
  message: string
  timestamp: string
  category: "Orders" | "Promos" | "System"
  isRead: boolean
  icon: keyof typeof Ionicons.glyphMap
  iconBgColor: string
  iconColor: string
  actionLabel?: string
  actionRoute?: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-101",
    title: "Order Shipped! 🚚",
    message:
      "Your order #ORD-2026-88421 has been handed over to the courier partner. Expected delivery tomorrow.",
    timestamp: "10m ago",
    category: "Orders",
    isRead: false,
    icon: "cube-outline",
    iconBgColor: "#EFF6FF",
    iconColor: "#2563EB",
    actionLabel: "Track Order",
    actionRoute: "/(all-order-info)/delivery-history",
  },
  {
    id: "NOTIF-102",
    title: "30% Flash Sale Live! 🔥",
    message:
      "Special discounts on fresh organic groceries and electronics. Offer valid until midnight today!",
    timestamp: "1h ago",
    category: "Promos",
    isRead: false,
    icon: "pricetag-outline",
    iconBgColor: "#FEF2F2",
    iconColor: "#DC2626",
    actionLabel: "Shop Sale",
    actionRoute: "/(drawer)/(tabs)/shop",
  },
  {
    id: "NOTIF-103",
    title: "Package Delivered 📦",
    message:
      "Your order #ORD-2026-87109 was delivered successfully to your Home address. Rate your experience!",
    timestamp: "3h ago",
    category: "Orders",
    isRead: false,
    icon: "checkmark-circle-outline",
    iconBgColor: "#F0FDF4",
    iconColor: "#16A34A",
    actionLabel: "View Delivery",
    actionRoute: "/(all-order-info)/delivery-history",
  },
  {
    id: "NOTIF-104",
    title: "Security & Login Notice 🔐",
    message:
      "Your account was accessed from a new device (iPhone 15 Pro, Dhaka BD). If this was you, no action needed.",
    timestamp: "Yesterday",
    category: "System",
    isRead: true,
    icon: "shield-checkmark-outline",
    iconBgColor: "#F3E8FF",
    iconColor: "#9333EA",
    actionLabel: "Security Settings",
    actionRoute: "/(all-order-info)/privacy-and-security",
  },
  {
    id: "NOTIF-105",
    title: "Cashback Credited 💸",
    message:
      "Congrats! BDT ৳150 cashback has been credited to your wallet balance for your recent purchases.",
    timestamp: "2 days ago",
    category: "Promos",
    isRead: true,
    icon: "gift-outline",
    iconBgColor: "#FFFBEB",
    iconColor: "#D97706",
    actionLabel: "View Balance",
  },
  {
    id: "NOTIF-106",
    title: "Order Payment Confirmed ✅",
    message:
      "Payment of ৳1,250 received via Cash on Delivery for order #ORD-2026-86402. Thank you for shopping with us!",
    timestamp: "3 days ago",
    category: "Orders",
    isRead: true,
    icon: "card-outline",
    iconBgColor: "#EFF6FF",
    iconColor: "#2563EB",
    actionLabel: "View Orders",
    actionRoute: "/(all-order-info)/my-orders",
  },
  {
    id: "NOTIF-107",
    title: "Terms & Policy Update 📜",
    message:
      "We updated our Privacy Policy and Terms of Service to improve your shopping safety.",
    timestamp: "5 days ago",
    category: "System",
    isRead: true,
    icon: "document-text-outline",
    iconBgColor: "#F3F4F6",
    iconColor: "#4B5563",
    actionLabel: "Read Terms",
    actionRoute: "/(all-order-info)/terms-and-conditions",
  },
]

export default function NotificationsScreen() {
  const { colors } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  )
  const [selectedCategory, setSelectedCategory] =
    useState<NotificationCategory>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  )

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [notifications, selectedCategory, searchQuery])

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    )
  }

  const handleToggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    )
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  const categories: NotificationCategory[] = [
    "All",
    "Orders",
    "Promos",
    "System",
  ]

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View
        style={tw.style("px-4 pb-3 border-b border-gray-100", {
          paddingTop: Math.max(insets.top + 8, 16),
          backgroundColor: colors.background,
        })}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={8}
              style={tw.style(
                "w-9 h-9 rounded-full items-center justify-center border",
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              )}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <View>
              <View style={tw`flex-row items-center gap-2`}>
                <Text
                  style={tw.style("text-xl font-bold", { color: colors.text })}
                >
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <View style={tw`bg-red-500 px-2 py-0.5 rounded-full`}>
                    <Text style={tw`text-white text-[11px] font-bold`}>
                      {unreadCount} new
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Stay updated with orders, offers & system alerts
              </Text>
            </View>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={tw`px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100`}
            >
              <Text style={tw`text-xs font-semibold text-blue-600`}>
                Mark read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View
          style={tw.style(
            "flex-row items-center rounded-2xl px-3.5 h-10 mt-3 border",
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
            style={tw.style("flex-1 text-sm ml-2.5", { color: colors.text })}
            placeholder="Search notifications..."
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
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

        {/* Filter Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`gap-2 pt-3`}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category
            const categoryCount = notifications.filter(
              (n) =>
                (category === "All" || n.category === category) && !n.isRead
            ).length

            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={tw.style(
                  "px-4 py-1.5 rounded-full border flex-row items-center gap-1.5",
                  isSelected
                    ? {
                        backgroundColor: "#C52405",
                        borderColor: "#C52405",
                      }
                    : {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      }
                )}
              >
                <Text
                  style={tw.style("text-xs font-medium", {
                    color: isSelected ? "#FFFFFF" : colors.text,
                  })}
                >
                  {category}
                </Text>
                {categoryCount > 0 && (
                  <View
                    style={tw.style("px-1.5 py-0.2 rounded-full", {
                      backgroundColor: isSelected
                        ? "rgba(255,255,255,0.3)"
                        : "#FEF2F2",
                    })}
                  >
                    <Text
                      style={tw.style("text-[10px] font-bold", {
                        color: isSelected ? "#FFFFFF" : "#C52405",
                      })}
                    >
                      {categoryCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* ── NOTIFICATION LIST ── */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw.style("p-4 gap-3.5", {
          paddingBottom: Math.max(insets.bottom + 24, 32),
        })}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-16 px-6 gap-3`}>
            <View
              style={tw`w-16 h-16 rounded-full bg-gray-100 items-center justify-center`}
            >
              <Ionicons
                name="notifications-off-outline"
                size={32}
                color="#9CA3AF"
              />
            </View>
            <Text
              style={tw.style("text-base font-bold text-center", {
                color: colors.text,
              })}
            >
              No Notifications Found
            </Text>
            <Text
              style={tw.style("text-xs text-center leading-5 max-w-[260px]", {
                color: colors.mutedForeground,
              })}
            >
              {searchQuery
                ? `No notifications matching "${searchQuery}"`
                : `You don't have any ${selectedCategory.toLowerCase()} notifications right now.`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleToggleReadStatus(item.id)}
            style={tw.style(
              "p-4 rounded-2xl border flex-row gap-3.5 relative",
              {
                backgroundColor: item.isRead ? colors.surface : "#FEF2F2",
                borderColor: item.isRead ? colors.border : "#FCA5A5",
              }
            )}
          >
            {/* Category Icon */}
            <View
              style={tw.style(
                "w-11 h-11 rounded-2xl items-center justify-center shrink-0",
                {
                  backgroundColor: item.iconBgColor,
                }
              )}
            >
              <Ionicons name={item.icon} size={22} color={item.iconColor} />
            </View>

            {/* Notification Content */}
            <View style={tw`flex-1 gap-1`}>
              <View style={tw`flex-row items-center justify-between gap-2`}>
                <Text
                  style={tw.style("text-sm font-bold flex-1", {
                    color: colors.text,
                  })}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={tw.style("text-[11px]", {
                    color: colors.mutedForeground,
                  })}
                >
                  {item.timestamp}
                </Text>
              </View>

              <Text
                style={tw.style("text-xs leading-4.5", {
                  color: colors.mutedForeground,
                })}
              >
                {item.message}
              </Text>

              {/* Action Button & Controls */}
              <View style={tw`flex-row items-center justify-between mt-2 pt-1`}>
                {item.actionLabel ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (!item.isRead) handleToggleReadStatus(item.id)
                      if (item.actionRoute) router.push(item.actionRoute as any)
                    }}
                    style={tw`px-3 py-1 rounded-lg bg-red-600 self-start`}
                  >
                    <Text style={tw`text-[11px] font-semibold text-white`}>
                      {item.actionLabel} →
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}

                <View style={tw`flex-row items-center gap-3`}>
                  <TouchableOpacity
                    onPress={() => handleToggleReadStatus(item.id)}
                    hitSlop={6}
                  >
                    <Ionicons
                      name={
                        item.isRead
                          ? "mail-unread-outline"
                          : "checkmark-done-outline"
                      }
                      size={16}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteNotification(item.id)}
                    hitSlop={6}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Unread Red Dot */}
            {!item.isRead && (
              <View
                style={tw`absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-red-500`}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
