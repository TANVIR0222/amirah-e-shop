import { TopHeaderBar } from "@/components/ui/top-header-bar"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ScrollView, Text, View } from "react-native"

const TERMS_SECTIONS = [
  {
    id: "1",
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using Amirah E-Shop mobile application and services, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, please refrain from using our app and services.",
  },
  {
    id: "2",
    title: "2. User Account & Security",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and for restricting access to your mobile device. You agree to accept responsibility for all activities that occur under your account.",
  },
  {
    id: "3",
    title: "3. Product Information & Pricing",
    content:
      "We strive to display product images, descriptions, and prices as accurately as possible. Prices are quoted in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise. Prices are subject to change without prior notice.",
  },
  {
    id: "4",
    title: "4. Ordering & Payment Methods",
    content:
      "Orders placed through the app constitute an offer to purchase. We accept Cash on Delivery (COD), Mobile Financial Services (bKash, Nagad), and debit/credit cards. We reserve the right to decline any order for security or stock availability reasons.",
  },
  {
    id: "5",
    title: "5. Delivery Policy",
    content:
      "Standard delivery times range from 24 to 48 hours depending on your delivery address. Delivery delays due to adverse weather or traffic conditions will be communicated promptly through order status updates.",
  },
  {
    id: "6",
    title: "6. Return & Refund Policy",
    content:
      "Customers may request a return within 7 days of delivery for damaged, expired, or incorrect products. Refunds will be processed within 3-5 business days upon inspection and approval.",
  },
  {
    id: "7",
    title: "7. Limitation of Liability",
    content:
      "Amirah E-Shop shall not be liable for indirect, incidental, or consequential damages resulting from product usage or inability to access services.",
  },
]

export default function TermsAndConditionsScreen() {
  const { colors } = useAppTheme()

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* Top Header */}
      <TopHeaderBar
        title="Terms & Conditions"
        subtitle="Last updated: July 2026"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-12 gap-4`}
      >
        {/* Banner */}
        <View
          style={tw.style(`p-4 rounded-2xl flex-row items-center gap-3`, {
            backgroundColor: "#FDECEA",
            borderWidth: 1,
            borderColor: "#F0653A" + "30",
          })}
        >
          <View
            style={tw`w-10 h-10 rounded-full bg-[#F0653A] items-center justify-center`}
          >
            <Ionicons name="document-text" size={20} color="#fff" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold text-[#F0653A]`}>
              Amirah E-Shop User Agreement
            </Text>
            <Text style={tw`text-xs text-[#A81E04] mt-0.5`}>
              Please read these terms carefully before making purchases on our
              platform.
            </Text>
          </View>
        </View>

        {/* Content list */}
        {TERMS_SECTIONS.map((section) => (
          <View
            key={section.id}
            style={tw.style(`p-4 rounded-2xl border`, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            })}
          >
            <Text
              style={tw.style(`text-sm font-bold mb-1.5`, {
                color: colors.text,
              })}
            >
              {section.title}
            </Text>
            <Text
              style={tw.style(`text-xs leading-5`, {
                color: colors.mutedForeground,
              })}
            >
              {section.content}
            </Text>
          </View>
        ))}

        <Text
          style={tw.style(`text-center text-xs mt-2`, {
            color: colors.mutedForeground,
          })}
        >
          Have questions regarding our terms? Contact support at
          support@amiraheshop.com
        </Text>
      </ScrollView>
    </View>
  )
}
