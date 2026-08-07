import MainInput from "@/components/ui/MainInput"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import { logger } from "@/utils/logger"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { toast } from "sonner-native"
import { useValidateCouponMutation } from "../api/shop-api"

interface ProductCouponsProps {
  onApplyCoupon?: (code: string) => void
  onRemoveCoupon?: () => void
  appliedCouponCode?: string | null
}

export default function ProductCoupons({ onApplyCoupon }: ProductCouponsProps) {
  const { colors } = useAppTheme()

  const [couponCode, setCouponCode] = useState("")

  const [validateCoupon, { isLoading }] = useValidateCouponMutation()

  const handleApply = async () => {
    const targetCode = couponCode.trim().toUpperCase()

    if (!targetCode) {
      toast.error("Please enter a valid coupon code")
      return
    }

    let response

    try {
      response = await validateCoupon({
        coupon_code: targetCode,
        cart_subtotal: 1000, // Replace with actual cart subtotal
      }).unwrap()
    } catch (err: any) {
      toast.error("An error occurred while validating the coupon")
      logger.error("Coupon validation error:", err)
      return
    }

    if (response.success) {
      setCouponCode("")

      if (typeof onApplyCoupon === "function") {
        onApplyCoupon(targetCode)
      }
    } else {
      const message = response.message ?? "Invalid coupon code"
      toast.error(message)
    }
  }

  return (
    <>
      <View
        style={tw.style("p-4 rounded-2xl border bg-white mb-4 shadow-sm", {
          borderColor: colors.border,
        })}
      >
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <View style={tw`flex-row items-center gap-2`}>
            <View
              style={tw`w-8 h-8 rounded-full bg-[#FFF0E6] items-center justify-center`}
            >
              <Ionicons name="pricetag-outline" size={18} color="#F0653A" />
            </View>

            <Text style={tw`text-sm font-bold text-gray-900`}>
              Coupons & Promo Codes
            </Text>
          </View>
        </View>

        {/* Input + Button */}
        <View style={tw`flex-row items-center justify-between`}>
          <MainInput
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={(text) => {
              setCouponCode(text)
            }}
            autoCapitalize="characters"
            outerContainerStyle={tw`mb-0 w-[78%]`}
            containerStyle={tw`h-11 rounded-xl px-3`}
            textInputStyle={tw`text-xs font-semibold uppercase`}
          />

          <TouchableOpacity
            onPress={handleApply}
            disabled={isLoading || !couponCode.trim()}
            activeOpacity={0.8}
            style={tw.style(
              "w-[20%] h-11 rounded-xl items-center justify-center bg-[#F0653A]",
              (isLoading || !couponCode.trim()) && "opacity-60"
            )}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={tw`text-xs font-bold text-white`}>Apply</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}
// import MainInput from "@/components/ui/MainInput"
// import tw from "@/lib/tailwind"
// import { useAppTheme } from "@/theme/theme-provider"
// import { Ionicons } from "@expo/vector-icons"
// import React, { useState } from "react"
// import {
//   ActivityIndicator,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native"

// export interface CouponItem {
//   code: string
//   title: string
//   discount: string
//   description?: string
// }

// interface ProductCouponsProps {
//   onApplyCoupon?: (code: string) => void
//   onRemoveCoupon?: () => void
//   appliedCouponCode?: string | null
// }

// const SAMPLE_COUPONS: CouponItem[] = [
//   {
//     code: "EID100",
//     title: "Eid Special",
//     discount: "৳100 OFF",
//     description: "Min order ৳500",
//   },
//   {
//     code: "SAVE50",
//     title: "Save Flat",
//     discount: "৳50 OFF",
//     description: "Min order ৳300",
//   },
//   {
//     code: "AMIRAH10",
//     title: "10% Discount",
//     discount: "10% OFF",
//     description: "First purchase",
//   },
// ]

// export default function ProductCoupons({
//   onApplyCoupon,
//   onRemoveCoupon,
//   appliedCouponCode = null,
// }: ProductCouponsProps) {
//   const { colors } = useAppTheme()
//   const [couponCode, setCouponCode] = useState("")
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [activeCoupon, setActiveCoupon] = useState<CouponItem | null>(
//     appliedCouponCode
//       ? SAMPLE_COUPONS.find((c) => c.code === appliedCouponCode) || {
//           code: appliedCouponCode,
//           title: "Applied Coupon",
//           discount: "Applied",
//         }
//       : null
//   )

//   const handleApply = (codeToApply?: string) => {
//     const targetCode = (codeToApply || couponCode).trim().toUpperCase()
//     if (!targetCode) {
//       setError("Please enter a valid coupon code")
//       return
//     }

//     setError("")
//     setLoading(true)

//     setTimeout(() => {
//       setLoading(false)
//       const found = SAMPLE_COUPONS.find((c) => c.code === targetCode)
//       if (found) {
//         setActiveCoupon(found)
//         setCouponCode("")
//         if (onApplyCoupon) onApplyCoupon(found.code)
//       } else if (targetCode.length >= 4) {
//         // Generic valid coupon code
//         const customCoupon = {
//           code: targetCode,
//           title: "Promo Applied",
//           discount: "Discount Applied",
//         }
//         setActiveCoupon(customCoupon)
//         setCouponCode("")
//         if (onApplyCoupon) onApplyCoupon(targetCode)
//       } else {
//         setError("Invalid coupon code. Try SAVE50 or EID100")
//       }
//     }, 400)
//   }

//   const handleRemove = () => {
//     setActiveCoupon(null)
//     setCouponCode("")
//     setError("")
//     if (onRemoveCoupon) onRemoveCoupon()
//   }

//   return (
//     <View
//       style={tw.style(
//         "p-4 rounded-2xl border bg-white mb-4 shadow-sm",
//         { borderColor: colors.border }
//       )}
//     >
//       {/* Header Title */}
//       <View style={tw`flex-row items-center justify-between mb-3`}>
//         <View style={tw`flex-row items-center gap-2`}>
//           <View
//             style={tw`w-8 h-8 rounded-full bg-[#FFF0E6] items-center justify-center`}
//           >
//             <Ionicons name="pricetag-outline" size={18} color="#F0653A" />
//           </View>
//           <Text style={tw`text-sm font-bold text-gray-900`}>
//             Coupons & Promo Codes
//           </Text>
//         </View>
//         {activeCoupon && (
//           <View style={tw`px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200`}>
//             <Text style={tw`text-xs font-semibold text-emerald-700`}>
//               Coupon Active
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Applied Coupon View */}
//       {activeCoupon ? (
//         <View
//           style={tw`p-3.5 rounded-xl bg-[#FFF0E6] border border-dashed border-[#F0653A] flex-row items-center justify-between`}
//         >
//           <View style={tw`flex-row items-center gap-3 flex-1`}>
//             <Ionicons name="checkmark-circle" size={24} color="#F0653A" />
//             <View style={tw`flex-1`}>
//               <Text style={tw`text-xs font-bold text-[#F0653A] uppercase tracking-wider`}>
//                 {activeCoupon.code}
//               </Text>
//               <Text style={tw`text-xs text-gray-600 font-medium`}>
//                 {activeCoupon.title} • {activeCoupon.discount}
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity
//             onPress={handleRemove}
//             activeOpacity={0.7}
//             style={tw`px-3 py-1.5 rounded-lg bg-white border border-gray-200 items-center justify-center`}
//           >
//             <Text style={tw`text-xs font-bold text-red-500`}>Remove</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           {/* Input (80%) and Button (20%) Row */}
//           <View style={tw`flex-row items-center justify-between`}>
//             {/* 80% MainInput */}
//             <MainInput
//               placeholder="Enter coupon code"
//               value={couponCode}
//               onChangeText={(text) => {
//                 setCouponCode(text)
//                 if (error) setError("")
//               }}
//               autoCapitalize="characters"
//               outerContainerStyle={tw`mb-0 w-[78%]`}
//               containerStyle={tw`h-11 rounded-xl px-3`}
//               textInputStyle={tw`text-xs font-semibold uppercase`}
//             />

//             {/* 20% Apply Button */}
//             <TouchableOpacity
//               onPress={() => handleApply()}
//               disabled={loading || !couponCode.trim()}
//               activeOpacity={0.8}
//               style={tw.style(
//                 "w-[20%] h-11 rounded-xl items-center justify-center bg-[#F0653A]",
//                 (!couponCode.trim() || loading) && "opacity-60"
//               )}
//             >
//               {loading ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={tw`text-xs font-bold text-white`}>Apply</Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Error Message */}
//           {error ? (
//             <Text style={tw`text-xs  text-red font-medium mt-1.5 ml-1`}>
//               {error}
//             </Text>
//           ) : null}

//           {/* Available Coupons Chips */}
//           {/* <View style={tw`mt-3 pt-3 border-t border-gray-100`}>
//             <Text style={tw`text-xs font-medium text-gray-500 mb-2`}>
//               Available Coupons:
//             </Text>
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={tw`flex-row gap-2`}
//             >
//               {SAMPLE_COUPONS.map((coupon) => (
//                 <TouchableOpacity
//                   key={coupon.code}
//                   onPress={() => handleApply(coupon.code)}
//                   activeOpacity={0.7}
//                   style={tw`px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50/60 flex-row items-center gap-1.5`}
//                 >
//                   <Text style={tw`text-xs font-bold text-[#F0653A]`}>
//                     {coupon.code}
//                   </Text>
//                   <Text style={tw`text-[10px] text-gray-500 font-medium`}>
//                     ({coupon.discount})
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View> */}
//         </>
//       )}
//     </View>
//   )
// }
