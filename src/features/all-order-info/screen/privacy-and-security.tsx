import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type SecuritySetting = {
  id: string
  title: string
  subtitle: string
  value: boolean
}

export default function PrivacyAndSecurityScreen() {
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()

  const [settings, setSettings] = useState<SecuritySetting[]>([
    {
      id: "biometric",
      title: "Biometric Login / FaceID",
      subtitle: "Use fingerprint or face recognition for quick app access",
      value: true,
    },
    {
      id: "notifications",
      title: "Order & Promo Notifications",
      subtitle: "Receive live updates on delivery and exclusive discounts",
      value: true,
    },
    {
      id: "location",
      title: "Location Access",
      subtitle: "Allow app to auto-detect delivery address for faster checkout",
      value: true,
    },
    {
      id: "analytics",
      title: "Personalised Product Recommendations",
      subtitle: "Allow us to suggest items based on your shopping history",
      value: false,
    },
  ])

  const toggleSwitch = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: !s.value } : s))
    )
  }

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* Header */}
      <View
        style={tw.style(`px-4 pb-3 flex-row items-center gap-3 border-b`, {
          paddingTop: top + 10,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        })}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={8}
          style={tw.style(`w-9 h-9 rounded-full items-center justify-center`, {
            backgroundColor: colors.background,
          })}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={tw`flex-1`}>
          <Text style={tw.style(`text-lg font-bold`, { color: colors.text })}>
            Privacy & Security
          </Text>
          <Text style={tw.style(`text-xs`, { color: colors.mutedForeground })}>
            Manage your permissions & data safety
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-12 gap-5`}
      >
        {/* Security Shield Banner */}
        <View
          style={tw.style(`p-4 rounded-2xl flex-row items-center gap-3`, {
            backgroundColor: "#FDECEA",
            borderWidth: 1,
            borderColor: "#C52405" + "30",
          })}
        >
          <View
            style={tw`w-10 h-10 rounded-full bg-[#C52405] items-center justify-center`}
          >
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
          </View>

          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold text-[#C52405]`}>
              256-Bit Encrypted Data Protection
            </Text>
            <Text style={tw`text-xs text-[#A81E04] mt-0.5`}>
              Your personal data and transaction records are fully encrypted and
              protected under international data privacy standards.
            </Text>
          </View>
        </View>

        {/* Security Toggles */}
        <View style={tw`gap-2`}>
          <Text
            style={tw.style(`text-xs font-bold uppercase tracking-wider px-1`, {
              color: colors.mutedForeground,
            })}
          >
            App Permissions & Security
          </Text>

          <View
            style={tw.style(`rounded-2xl border overflow-hidden`, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            })}
          >
            {settings.map((item, idx) => (
              <View
                key={item.id}
                style={tw.style(
                  `flex-row items-center justify-between p-4`,
                  idx < settings.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }
                )}
              >
                <View style={tw`flex-1 pr-3`}>
                  <Text
                    style={tw.style(`text-sm font-semibold`, {
                      color: colors.text,
                    })}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={tw.style(`text-xs mt-0.5`, {
                      color: colors.mutedForeground,
                    })}
                  >
                    {item.subtitle}
                  </Text>
                </View>

                <Switch
                  value={item.value}
                  onValueChange={() => toggleSwitch(item.id)}
                  trackColor={{ false: colors.border, true: "#C52405" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Data Rights Info */}
        <View style={tw`gap-2`}>
          <Text
            style={tw.style(`text-xs font-bold uppercase tracking-wider px-1`, {
              color: colors.mutedForeground,
            })}
          >
            Data Privacy Policy
          </Text>

          <View
            style={tw.style(`p-4 rounded-2xl border gap-3`, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            })}
          >
            <View style={tw`flex-row items-center gap-2`}>
              <Ionicons name="eye-off-outline" size={18} color="#C52405" />
              <Text
                style={tw.style(`text-sm font-bold`, { color: colors.text })}
              >
                No Third-Party Data Sales
              </Text>
            </View>
            <Text
              style={tw.style(`text-xs leading-5`, {
                color: colors.mutedForeground,
              })}
            >
              We never sell or rent your personal information to third-party
              advertisers. Your data is used exclusively to fulfill your orders
              and enhance your shopping experience.
            </Text>
          </View>
        </View>

        {/* Delete Account Link */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={tw.style(
            `p-4 rounded-2xl border flex-row items-center justify-between`,
            {
              backgroundColor: "#FEF2F2",
              borderColor: "#EF4444" + "30",
            }
          )}
        >
          <View style={tw`flex-row items-center gap-3`}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={tw`text-sm font-bold text-[#EF4444]`}>
              Request Account Deletion
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#EF4444" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
