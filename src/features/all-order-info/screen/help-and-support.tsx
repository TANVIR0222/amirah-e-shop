import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useState } from "react"
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type FAQItem = {
  id: string
  category: string
  question: string
  answer: string
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "1",
    category: "Orders & Shipping",
    question: "How long does delivery take?",
    answer:
      "Standard delivery in Dhaka takes 24 to 36 hours. Express same-day delivery is available for orders placed before 12 PM. Outside Dhaka takes 2-3 business days.",
  },
  {
    id: "2",
    category: "Orders & Shipping",
    question: "How can I track my order?",
    answer:
      "Go to Profile > My Orders, select your active order, and tap 'View Details' or 'Track Order' to see real-time updates on your delivery.",
  },
  {
    id: "3",
    category: "Payment & Discounts",
    question: "What payment methods are supported?",
    answer:
      "We accept Cash on Delivery (COD), bKash, Nagad, Rocket, as well as Visa, MasterCard, and AMEX credit or debit cards.",
  },
  {
    id: "4",
    category: "Payment & Discounts",
    question: "How do I apply a discount voucher or coupon?",
    answer:
      "On the Checkout / Cart screen, enter your promo code in the 'Apply Coupon' box before proceeding to payment.",
  },
  {
    id: "5",
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer:
      "We offer a 7-day hassle-free return policy. If you receive damaged, expired, or incorrect products, go to Profile > Returns & Refunds to initiate a request.",
  },
  {
    id: "6",
    category: "Returns & Refunds",
    question: "How fast are refunds processed?",
    answer:
      "Once your returned product passes quality inspection, bKash/Nagad refunds take 24 hours, while bank card refunds take 3-5 business days.",
  },
]

export default function HelpAndSupportScreen() {
  const { top } = useSafeAreaInsets()
  const { colors } = useAppTheme()

  const [expandedId, setExpandedId] = useState<string | null>("1")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <View style={tw.style(`flex-1`, { backgroundColor: colors.background })}>
      {/* Top Header */}
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
            Help & Support
          </Text>
          <Text style={tw.style(`text-xs`, { color: colors.mutedForeground })}>
            Frequently Asked Questions & Contact
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-12 gap-5`}
      >
        {/* Support Banner */}
        <View
          style={tw.style(`p-4 rounded-2xl flex-row items-center gap-3`, {
            backgroundColor: "#C52405",
          })}
        >
          <View
            style={tw`w-12 h-12 rounded-2xl bg-white/20 items-center justify-center`}
          >
            <Ionicons name="headset" size={24} color="#fff" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-bold text-white`}>
              We are here 24/7 to help!
            </Text>
            <Text style={tw`text-xs text-red-100 mt-0.5`}>
              Have an issue with your order? Reach out to our customer care team
              anytime.
            </Text>
          </View>
        </View>

        {/* Quick Contact Buttons */}
        <View style={tw`flex-row gap-2.5`}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={tw.style(
              `flex-1 p-3 rounded-2xl border items-center gap-1.5`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <View
              style={tw`w-9 h-9 rounded-xl bg-[#FDECEA] items-center justify-center`}
            >
              <Ionicons name="chatbubbles" size={18} color="#C52405" />
            </View>
            <Text style={tw.style(`text-xs font-bold`, { color: colors.text })}>
              Live Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={tw.style(
              `flex-1 p-3 rounded-2xl border items-center gap-1.5`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <View
              style={tw`w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center`}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#059669" />
            </View>
            <Text style={tw.style(`text-xs font-bold`, { color: colors.text })}>
              WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={tw.style(
              `flex-1 p-3 rounded-2xl border items-center gap-1.5`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            )}
          >
            <View
              style={tw`w-9 h-9 rounded-xl bg-blue-100 items-center justify-center`}
            >
              <Ionicons name="call" size={18} color="#2563EB" />
            </View>
            <Text style={tw.style(`text-xs font-bold`, { color: colors.text })}>
              Call Us
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section Header + Search */}
        <View style={tw`gap-3`}>
          <Text
            style={tw.style(`text-xs font-bold uppercase tracking-wider px-1`, {
              color: colors.mutedForeground,
            })}
          >
            Frequently Asked Questions (FAQ)
          </Text>

          {/* Search FAQ */}
          <View
            style={tw.style(
              `flex-row items-center rounded-xl border px-3 h-10 gap-2`,
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
              style={tw.style(`flex-1 text-sm h-10`, { color: colors.text })}
              placeholder="Search FAQ questions..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={6}>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ Accordion List */}
        <View style={tw`gap-2.5`}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id
            return (
              <View
                key={faq.id}
                style={tw.style(`rounded-2xl border overflow-hidden`, {
                  backgroundColor: colors.surface,
                  borderColor: isExpanded ? "#C52405" : colors.border,
                })}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleExpand(faq.id)}
                  style={tw`p-4 flex-row items-center justify-between gap-2`}
                >
                  <Text
                    style={tw.style(`flex-1 text-sm font-semibold`, {
                      color: isExpanded ? "#C52405" : colors.text,
                    })}
                  >
                    {faq.question}
                  </Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={isExpanded ? "#C52405" : colors.mutedForeground}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View
                    style={tw.style(`px-4 pb-4 pt-1 border-t`, {
                      borderTopColor: colors.border,
                    })}
                  >
                    <Text
                      style={tw.style(`text-xs leading-5`, {
                        color: colors.mutedForeground,
                      })}
                    >
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            )
          })}

          {filteredFaqs.length === 0 && (
            <View style={tw`items-center py-10`}>
              <Ionicons
                name="help-circle-outline"
                size={48}
                color={colors.mutedForeground}
              />
              <Text
                style={tw.style(`text-sm font-semibold mt-2`, {
                  color: colors.text,
                })}
              >
                No matching questions found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
