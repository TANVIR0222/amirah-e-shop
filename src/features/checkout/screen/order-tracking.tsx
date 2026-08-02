import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useState } from "react"
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type TrackingStep = {
  id: number
  title: string
  subtitle: string
  time: string
  status: "completed" | "current" | "pending"
  icon: keyof typeof Ionicons.glyphMap
}

const TRACKING_STEPS: TrackingStep[] = [
  {
    id: 1,
    title: "Order Placed",
    subtitle: "Your order #ORD-2026-88421 was received",
    time: "02:15 PM",
    status: "completed",
    icon: "document-text",
  },
  {
    id: 2,
    title: "Order Packed & Verified",
    subtitle: "Items packed at Gulshan Warehouse",
    time: "03:00 PM",
    status: "completed",
    icon: "cube",
  },
  {
    id: 3,
    title: "Out for Delivery",
    subtitle: "Rider is on the way to your address",
    time: "03:45 PM",
    status: "current",
    icon: "bicycle",
  },
  {
    id: 4,
    title: "Delivered",
    subtitle: "Package handed over to recipient",
    time: "Expected ~04:30 PM",
    status: "pending",
    icon: "checkmark-circle",
  },
]

export default function OrderTrackingScreen() {
  const { colors } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [steps] = useState<TrackingStep[]>(TRACKING_STEPS)

  const handleCallRider = () => {
    Linking.openURL("tel:+8801700000001").catch(() => {})
  }

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View
        style={tw.style("px-4 pb-3 border-b border-gray-100", {
          paddingTop: Math.max(insets.top + 8, 16),
          backgroundColor: colors.background,
        })}
      >
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

          <View style={tw`flex-1`}>
            <Text style={tw.style("text-xl font-bold", { color: colors.text })}>
              Track Live Order
            </Text>
            <Text style={tw.style("text-xs font-semibold text-[#F0653A]")}>
              Order #ORD-2026-88421
            </Text>
          </View>

          <View
            style={tw`px-3 py-1 rounded-full bg-red-50 border border-red-100 flex-row items-center gap-1.5`}
          >
            <View style={tw`w-2 h-2 rounded-full bg-red-500`} />
            <Text style={tw`text-[11px] font-bold text-red-600`}>LIVE</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw.style("p-4 gap-4", {
          paddingBottom: Math.max(insets.bottom + 24, 32),
        })}
      >
        {/* Estimated Delivery Time Banner */}
        <View
          style={tw.style(
            "p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex-row items-center justify-between"
          )}
        >
          <View style={tw`gap-0.5 flex-1 mr-2`}>
            <Text style={tw`text-xs font-semibold text-red-800`}>
              Estimated Delivery Time
            </Text>
            <Text style={tw`text-lg font-bold text-[#F0653A]`}>
              Today, 04:30 PM (25-35 mins)
            </Text>
          </View>
          <View
            style={tw`w-12 h-12 rounded-2xl bg-white items-center justify-center border border-red-100`}
          >
            <Ionicons name="time-outline" size={24} color="#F0653A" />
          </View>
        </View>

        {/* Delivery Rider Contact Card */}
        <View
          style={tw.style("p-4 rounded-2xl border gap-3", {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          })}
        >
          <Text
            style={tw.style(
              "text-xs font-bold uppercase tracking-wider text-gray-400"
            )}
          >
            Assigned Delivery Rider
          </Text>

          <View style={tw`flex-row items-center gap-3`}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
              }}
              style={tw`w-12 h-12 rounded-full bg-gray-100 border border-gray-200`}
            />

            <View style={tw`flex-1`}>
              <Text
                style={tw.style("text-sm font-bold", { color: colors.text })}
              >
                Md. Tanvir Alam
              </Text>
              <Text style={tw.style("text-xs text-gray-500 mt-0.5")}>
                Honda Livo • Dhaka Metro HA-1234
              </Text>
              <View style={tw`flex-row items-center gap-1 mt-1`}>
                <Ionicons name="star" size={12} color="#D97706" />
                <Text style={tw`text-[11px] font-bold text-amber-700`}>
                  4.9 (182 deliveries)
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCallRider}
              style={tw`px-3.5 py-2.5 rounded-2xl bg-[#F0653A] flex-row items-center gap-1.5 shadow-sm`}
            >
              <Ionicons name="call-outline" size={16} color="#FFF" />
              <Text style={tw`text-xs font-bold text-white`}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stepper Timeline Tracker */}
        <View
          style={tw.style("p-4 rounded-2xl border gap-4", {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          })}
        >
          <Text style={tw.style("text-sm font-bold", { color: colors.text })}>
            Order Progress
          </Text>

          <View style={tw`gap-0`}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1
              const isDone = step.status === "completed"
              const isCurrent = step.status === "current"

              return (
                <View key={step.id} style={tw`flex-row gap-3.5 relative`}>
                  {/* Step Line Indicator */}
                  <View style={tw`items-center`}>
                    <View
                      style={tw.style(
                        "w-8 h-8 rounded-full items-center justify-center border z-10",
                        isDone
                          ? {
                              backgroundColor: "#16A34A",
                              borderColor: "#16A34A",
                            }
                          : isCurrent
                            ? {
                                backgroundColor: "#F0653A",
                                borderColor: "#F0653A",
                              }
                            : {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              }
                      )}
                    >
                      <Ionicons
                        name={step.icon}
                        size={15}
                        color={
                          isDone || isCurrent
                            ? "#FFFFFF"
                            : colors.mutedForeground
                        }
                      />
                    </View>

                    {!isLast && (
                      <View
                        style={tw.style(
                          "w-0.5 flex-1 min-h-[36px]",
                          isDone
                            ? { backgroundColor: "#16A34A" }
                            : { backgroundColor: colors.border }
                        )}
                      />
                    )}
                  </View>

                  {/* Step Description */}
                  <View style={tw`flex-1 pb-5`}>
                    <View style={tw`flex-row items-center justify-between`}>
                      <Text
                        style={tw.style(
                          "text-xs font-bold",
                          isCurrent
                            ? { color: "#F0653A" }
                            : isDone
                              ? { color: colors.text }
                              : { color: colors.mutedForeground }
                        )}
                      >
                        {step.title}
                      </Text>

                      <Text
                        style={tw.style("text-[11px]", {
                          color: colors.mutedForeground,
                        })}
                      >
                        {step.time}
                      </Text>
                    </View>

                    <Text
                      style={tw.style("text-[11px] mt-0.5 leading-4", {
                        color: colors.mutedForeground,
                      })}
                    >
                      {step.subtitle}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* Delivery Location Card */}
        <View
          style={tw.style("p-4 rounded-2xl border gap-2.5", {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          })}
        >
          <View style={tw`flex-row items-center gap-2`}>
            <Ionicons name="location-outline" size={18} color="#F0653A" />
            <Text style={tw.style("text-xs font-bold", { color: colors.text })}>
              Delivery Address (Home)
            </Text>
          </View>
          <Text style={tw.style("text-xs leading-5 text-gray-600 pl-6")}>
            House #45, Flat #4B, Road #11, Block-D, Mirpur 10, Dhaka
          </Text>
        </View>

        {/* Support CTA */}
        <TouchableOpacity
          onPress={() => router.push("/(all-order-info)/help-and-support")}
          style={tw`p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex-row items-center justify-between`}
        >
          <View style={tw`flex-row items-center gap-2.5`}>
            <Ionicons name="headset-outline" size={20} color="#2563EB" />
            <Text style={tw`text-xs font-bold text-gray-800`}>
              Having an issue with this delivery?
            </Text>
          </View>
          <Text style={tw`text-xs font-bold text-blue-600`}>Get Help →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
