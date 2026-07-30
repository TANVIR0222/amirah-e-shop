import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const HIGHLIGHTS = [
  {
    icon: "leaf-outline" as const,
    title: "100% Fresh & Authentic",
    desc: "Sourced directly from trusted local Bangladeshi farmers and authentic suppliers.",
  },
  {
    icon: "flash-outline" as const,
    title: "Express 24h Delivery",
    desc: "Lightning fast home delivery directly to your doorstep in Dhaka & nation-wide.",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Secure Payments",
    desc: "Support for Cash on Delivery, bKash, Nagad, and encrypted credit/debit card checkout.",
  },
  {
    icon: "heart-outline" as const,
    title: "Customer Satisfaction",
    desc: "Over 50,000+ happy customers with a 7-day hassle-free return and refund guarantee.",
  },
]

export default function AboutScreen() {
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()

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
            About Us
          </Text>
          <Text style={tw.style(`text-xs`, { color: colors.mutedForeground })}>
            Amirah E-Shop v2.4.0
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-12 gap-5`}
      >
        {/* Brand Card */}
        <View
          style={tw.style(`p-6 rounded-3xl items-center border`, {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          })}
        >
          <View
            style={tw`w-20 h-20 rounded-2xl bg-[#F0653A] items-center justify-center mb-3 shadow-md`}
          >
            <Image
              source={require("@/assets/app-icon/app-logo.png")}
              style={tw`w-14 h-14`}
              resizeMode="contain"
            />
          </View>

          <Text style={tw.style(`text-xl font-bold`, { color: colors.text })}>
            Amirah E-Shop
          </Text>
          <Text style={tw`text-xs font-semibold text-[#F0653A] mt-0.5`}>
            Your Trusted Everyday Shopping Companion
          </Text>

          <Text
            style={tw.style(`text-xs text-center mt-3 leading-5`, {
              color: colors.mutedForeground,
            })}
          >
            Amirah E-Shop is Bangladesh&apos;s premier online grocery and
            lifestyle shopping destination. We bridge the gap between local
            growers and household consumers with uncompromised quality and
            speed.
          </Text>
        </View>

        {/* Why Choose Us */}
        <View style={tw`gap-2.5`}>
          <Text
            style={tw.style(`text-xs font-bold uppercase tracking-wider px-1`, {
              color: colors.mutedForeground,
            })}
          >
            Why Choose Amirah E-Shop
          </Text>

          <View style={tw`gap-2.5`}>
            {HIGHLIGHTS.map((item) => (
              <View
                key={item.title}
                style={tw.style(
                  `p-4 rounded-2xl border flex-row items-center gap-3.5`,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }
                )}
              >
                <View
                  style={tw`w-10 h-10 rounded-xl bg-[#FDECEA] items-center justify-center`}
                >
                  <Ionicons name={item.icon} size={20} color="#F0653A" />
                </View>
                <View style={tw`flex-1`}>
                  <Text
                    style={tw.style(`text-sm font-bold`, {
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
                    {item.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Social / Web links */}
        <View style={tw`gap-2.5`}>
          <Text
            style={tw.style(`text-xs font-bold uppercase tracking-wider px-1`, {
              color: colors.mutedForeground,
            })}
          >
            Connect With Us
          </Text>

          <View
            style={tw.style(`p-4 rounded-2xl border flex-row justify-around`, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            })}
          >
            <TouchableOpacity style={tw`items-center gap-1`}>
              <Ionicons name="globe-outline" size={22} color="#F0653A" />
              <Text
                style={tw.style(`text-[11px] font-semibold`, {
                  color: colors.text,
                })}
              >
                Website
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={tw`items-center gap-1`}>
              <Ionicons name="logo-facebook" size={22} color="#1877F2" />
              <Text
                style={tw.style(`text-[11px] font-semibold`, {
                  color: colors.text,
                })}
              >
                Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={tw`items-center gap-1`}>
              <Ionicons name="logo-instagram" size={22} color="#E4405F" />
              <Text
                style={tw.style(`text-[11px] font-semibold`, {
                  color: colors.text,
                })}
              >
                Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={tw`items-center gap-1`}>
              <Ionicons name="mail-outline" size={22} color="#F0653A" />
              <Text
                style={tw.style(`text-[11px] font-semibold`, {
                  color: colors.text,
                })}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={tw`items-center pt-2`}>
          <Text style={tw.style(`text-xs`, { color: colors.mutedForeground })}>
            © 2026 Amirah E-Shop Ltd. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
