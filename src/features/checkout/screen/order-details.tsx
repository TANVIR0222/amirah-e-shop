import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Picker } from "@react-native-picker/picker"
import { router } from "expo-router"
import { Formik } from "formik"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { orderDetailsValidationSchema } from "../schema/order-details-validation-schema"

export const districts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Cumilla",
  "Cox's Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
]

export const areas: Record<string, string[]> = {
  Bagerhat: ["Bagerhat Sadar", "Mongla", "Rampal"],
  Bandarban: ["Bandarban Sadar", "Lama", "Naikhongchhari"],
  Barguna: ["Barguna Sadar", "Amtali", "Patharghata"],
  Barishal: ["Barishal Sadar", "Nathullabad", "Rupatoli"],
  Bhola: ["Bhola Sadar", "Borhanuddin", "Char Fasson"],
  Bogura: ["Bogura Sadar", "Sherpur", "Shibganj"],
  Brahmanbaria: ["Brahmanbaria Sadar", "Ashuganj", "Sarail"],
  Chandpur: ["Chandpur Sadar", "Hajiganj", "Matlab"],
  Chattogram: ["Agrabad", "Halishahar", "Kotwali", "Pahartali", "GEC Circle"],
  Chuadanga: ["Chuadanga Sadar", "Alamdanga", "Damurhuda"],
  Cumilla: ["Cumilla Sadar", "Daudkandi", "Chandina"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Teknaf", "Ukhia"],
  Dhaka: [
    "Mohakhali",
    "Banani",
    "Gulshan",
    "Uttara",
    "Mirpur",
    "Badda",
    "Dhanmondi",
    "Farmgate",
    "Mohammadpur",
    "Motijheel",
    "Wari",
    "Ramna",
    "Tejgaon",
  ],
  Dinajpur: ["Dinajpur Sadar", "Birampur", "Parbatipur"],
  Faridpur: ["Faridpur Sadar", "Bhanga", "Boalmari"],
  Feni: ["Feni Sadar", "Chhagalnaiya", "Sonagazi"],
  Gaibandha: ["Gaibandha Sadar", "Gobindaganj", "Palashbari"],
  Gazipur: ["Tongi", "Gazipur Sadar", "Kaliakair", "Sreepur"],
  Gopalganj: ["Gopalganj Sadar", "Kotalipara", "Tungipara"],
  Habiganj: ["Habiganj Sadar", "Madhabpur", "Nabiganj"],
  Jamalpur: ["Jamalpur Sadar", "Melandaha", "Islampur"],
  Jashore: ["Jashore Sadar", "Benapole", "Jhikargacha"],
  Jhalokathi: ["Jhalokathi Sadar", "Nalchity", "Kathalia"],
  Jhenaidah: ["Jhenaidah Sadar", "Kaliganj", "Maheshpur"],
  Joypurhat: ["Joypurhat Sadar", "Akkelpur", "Kalai"],
  Khagrachhari: ["Khagrachhari Sadar", "Mahalchhari", "Ramgarh"],
  Khulna: ["Sonadanga", "Khalishpur", "Daulatpur", "Boyra", "Khulna Sadar"],
  Kishoreganj: ["Kishoreganj Sadar", "Bhairab", "Katiadi"],
  Kurigram: ["Kurigram Sadar", "Nageshwari", "Ulipur"],
  Kushtia: ["Kushtia Sadar", "Bheramara", "Kumarkhali"],
  Lakshmipur: ["Lakshmipur Sadar", "Raipur", "Ramganj"],
  Lalmonirhat: ["Lalmonirhat Sadar", "Patgram", "Hatibandha"],
  Madaripur: ["Madaripur Sadar", "Shibchar", "Kalkini"],
  Magura: ["Magura Sadar", "Sreepur", "Mohammadpur"],
  Manikganj: ["Manikganj Sadar", "Singair", "Saturia"],
  Meherpur: ["Meherpur Sadar", "Gangni", "Mujibnagar"],
  Moulvibazar: ["Moulvibazar Sadar", "Sreemangal", "Kamalganj"],
  Munshiganj: ["Munshiganj Sadar", "Sreenagar", "Tongibari"],
  Mymensingh: ["Mymensingh Sadar", "Muktagacha", "Trishal", "Gauripur"],
  Naogaon: ["Naogaon Sadar", "Atrai", "Raninagar"],
  Narail: ["Narail Sadar", "Lohagara", "Kalia"],
  Narayanganj: ["Narayanganj Sadar", "Fatullah", "Rupganj", "Sonargaon"],
  Narsingdi: ["Narsingdi Sadar", "Madhabdi", "Belabo"],
  Natore: ["Natore Sadar", "Singra", "Bagatipara"],
  Netrokona: ["Netrokona Sadar", "Madan", "Khaliajuri"],
  Nilphamari: ["Nilphamari Sadar", "Saidpur", "Dimla"],
  Noakhali: ["Noakhali Sadar", "Maijdee", "Begumganj"],
  Pabna: ["Pabna Sadar", "Ishwardi", "Bera"],
  Panchagarh: ["Panchagarh Sadar", "Tetulia", "Debiganj"],
  Patuakhali: ["Patuakhali Sadar", "Kalapara", "Bauphal"],
  Pirojpur: ["Pirojpur Sadar", "Mathbaria", "Nazirpur"],
  Rajbari: ["Rajbari Sadar", "Goalanda", "Pangsha"],
  Rajshahi: ["Boalia", "Rajpara", "Motihar", "Shiroil", "Shaheb Bazar"],
  Rangamati: ["Rangamati Sadar", "Kaptai", "Baghaichhari"],
  Rangpur: ["Rangpur Sadar", "Pairaband", "Mithapukur", "Gangachara"],
  Satkhira: ["Satkhira Sadar", "Kaliganj", "Shyamnagar"],
  Shariatpur: ["Shariatpur Sadar", "Damudya", "Naria"],
  Sherpur: ["Sherpur Sadar", "Nakla", "Nalitabari"],
  Sirajganj: ["Sirajganj Sadar", "Belkuchi", "Shahjadpur"],
  Sunamganj: ["Sunamganj Sadar", "Chhatak", "Jagannathpur"],
  Sylhet: ["Amberkhana", "Zindabazar", "Tilagor", "Chauhatta", "Beanibazar"],
  Tangail: ["Tangail Sadar", "Mirzapur", "Madhupur"],
  Thakurgaon: ["Thakurgaon Sadar", "Pirganj", "Baliadangi"],
}

const subtotal = 1250

export default function OrderDetails() {
  const { colors } = useAppTheme()

  // const handleOrderSubmit = (values: any) => {
  //   setIsSubmitting(true)

  //   const deliveryCharge = values.district === "Dhaka" ? 60 : 120
  //   const total = subtotal + deliveryCharge

  //   const payload = {
  //     customer: {
  //       fullName: values.full_name,
  //       phoneNumber: values.phone_number,
  //     },
  //     address: {
  //       district: values.district,
  //       area: values.area,
  //       houseNo: values.house_no,
  //       locality: values.locality,
  //       fullAddress: values.full_address,
  //       note: values.note,
  //     },
  //     delivery: {
  //       type: values.delivery_type, // "Cash on Delivery" | "Online Delivery"
  //       paymentMethod: values.payment_method, // "COD" | "bKash" | "Card"
  //       charge: deliveryCharge,
  //     },
  //     summary: {
  //       subtotal,
  //       deliveryCharge,
  //       total,
  //     },
  //   }

  //   console.log("Submitting Order:", payload)

  //   setTimeout(() => {
  //     setIsSubmitting(false)
  //     showToast.success("অর্ডারটি সফলভাবে গৃহীত হয়েছে! (Order Placed Successfully)")
  //     router.replace("/common/payment-successful")
  //   }, 1200)
  // }

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={styles.container}>
        <Screen scroll={false}>
          {/* Header */}
          <View style={tw`flex-row items-center gap-3 mb-3`}>
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
              <Text
                style={tw.style("text-xl font-bold", { color: colors.text })}
              >
                Checkout
              </Text>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Delivery & Payment Information
              </Text>
            </View>

            <View
              style={tw.style("px-2.5 py-1 rounded-full border", {
                backgroundColor: "#FFFBEB",
                borderColor: "#FDE68A",
              })}
            >
              <Text style={tw`text-[11px] font-bold text-amber-700`}>
                BDT ৳
              </Text>
            </View>
          </View>

          <Formik
            initialValues={{
              full_name: "",
              phone_number: "",
              district: "Dhaka",
              area: "Mirpur",
              house_no: "",
              locality: "",
              full_address: "",
              note: "",
              delivery_type: "Cash on Delivery", // "Cash on Delivery" or "Online Delivery"
              payment_method: "COD", // "COD", "bKash", "Card"
            }}
            validationSchema={orderDetailsValidationSchema}
            onSubmit={() => {}}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => {
              const deliveryCharge = values.district === "Dhaka" ? 60 : 120
              const total = subtotal + deliveryCharge

              return (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={tw`pb-20`}
                  style={tw`flex-1`}
                >
                  <View style={tw`gap-4`}>
                    {/* SECTION 1: CUSTOMER DETAILS */}
                    <Text
                      style={tw.style("text-base font-bold", {
                        color: colors.text,
                      })}
                    >
                      1. Personal Information
                    </Text>

                    <MainInput
                      label="Full Name *"
                      placeholder="Enter your full name"
                      value={values.full_name}
                      onChangeText={handleChange("full_name")}
                      onBlur={() => handleBlur("full_name")}
                      error={errors.full_name}
                      touched={touched.full_name}
                    />

                    <MainInput
                      label="Phone Number *"
                      placeholder="01XXXXXXXXX"
                      keyboardType="phone-pad"
                      value={values.phone_number}
                      onChangeText={handleChange("phone_number")}
                      onBlur={() => handleBlur("phone_number")}
                      error={errors.phone_number}
                      touched={touched.phone_number}
                    />

                    {/* SECTION 2: DELIVERY ADDRESS */}
                    <Text
                      style={tw.style("text-base font-bold mt-2", {
                        color: colors.text,
                      })}
                    >
                      2. Delivery Address
                    </Text>

                    {/* District & Area Pickers */}
                    <View style={tw`flex-row gap-3`}>
                      {/* District Picker */}
                      <View style={tw`flex-1`}>
                        <Text
                          style={tw.style("mb-2 text-sm font-medium", {
                            color: colors.text,
                          })}
                        >
                          District *
                        </Text>
                        <View
                          style={tw.style(
                            "border rounded-2xl bg-white overflow-hidden",
                            { borderColor: colors.border }
                          )}
                        >
                          <Picker
                            selectedValue={values.district}
                            onValueChange={(item) => {
                              setFieldValue("district", item)
                              const firstArea = areas[item]?.[0] || ""
                              setFieldValue("area", firstArea)
                            }}
                          >
                            <Picker.Item label="Select District" value="" />
                            {districts.map((item) => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </View>
                        {!!errors.district && touched.district && (
                          <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>
                            {errors.district}
                          </Text>
                        )}
                      </View>

                      {/* Area Picker */}
                      <View style={tw`flex-1`}>
                        <Text
                          style={tw.style("mb-2 text-sm font-medium", {
                            color: colors.text,
                          })}
                        >
                          Area *
                        </Text>
                        <View
                          style={tw.style(
                            "border rounded-2xl bg-white overflow-hidden",
                            { borderColor: colors.border }
                          )}
                        >
                          <Picker
                            selectedValue={values.area}
                            onValueChange={(item) =>
                              setFieldValue("area", item)
                            }
                          >
                            <Picker.Item label="Select Area" value="" />
                            {(areas[values.district] || []).map((item) => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </View>
                        {!!errors.area && touched.area && (
                          <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>
                            {errors.area}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* House No / Street */}
                    <MainInput
                      label="Building / House No / Floor / Street *"
                      placeholder="e.g. House #45, Flat #4B, Road #11"
                      value={values.house_no}
                      onChangeText={handleChange("house_no")}
                      onBlur={() => handleBlur("house_no")}
                      error={errors.house_no}
                      touched={touched.house_no}
                    />

                    {/* Locality / Landmark */}
                    <MainInput
                      label="Colony / Suburb / Locality / Landmark *"
                      placeholder="e.g. Near Mirpur 10 Circle"
                      value={values.locality}
                      onChangeText={handleChange("locality")}
                      onBlur={() => handleBlur("locality")}
                      error={errors.locality}
                      touched={touched.locality}
                    />

                    {/* Full Address */}
                    <MainInput
                      label="Full Address *"
                      placeholder="e.g. House #45, Road #11, Block-D, Mirpur 10, Dhaka"
                      value={values.full_address}
                      onChangeText={handleChange("full_address")}
                      onBlur={() => handleBlur("full_address")}
                      error={errors.full_address}
                      touched={touched.full_address}
                      multiline
                      numberOfLines={3}
                    />

                    {/* Order Note Optional */}
                    <MainInput
                      label="Order Note (Optional)"
                      placeholder="Any special instructions..."
                      value={values.note}
                      onChangeText={handleChange("note")}
                      onBlur={() => handleBlur("note")}
                      multiline
                      numberOfLines={3}
                    />

                    {/* SECTION 3: DELIVERY & PAYMENT OPTION */}
                    <Text
                      style={tw.style("text-base font-bold mt-2", {
                        color: colors.text,
                      })}
                    >
                      3. Delivery & Payment Options
                    </Text>

                    {/* Delivery Type Option */}
                    <View style={tw`flex-row gap-3`}>
                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue("delivery_type", "Cash on Delivery")
                          setFieldValue("payment_method", "COD")
                        }}
                        style={tw.style(
                          "flex-1 p-3.5 rounded-2xl border flex-row items-center gap-2.5",
                          values.delivery_type === "Cash on Delivery"
                            ? {
                                backgroundColor: "#FEF2F2",
                                borderColor: "#C52405",
                              }
                            : {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              }
                        )}
                      >
                        <Ionicons
                          name={
                            values.delivery_type === "Cash on Delivery"
                              ? "radio-button-on"
                              : "radio-button-off"
                          }
                          size={18}
                          color={
                            values.delivery_type === "Cash on Delivery"
                              ? "#C52405"
                              : colors.mutedForeground
                          }
                        />
                        <View style={tw`flex-1`}>
                          <Text
                            style={tw.style("text-xs font-bold", {
                              color: colors.text,
                            })}
                          >
                            Cash on Delivery
                          </Text>
                          <Text
                            style={tw`text-[11px] font-semibold text-green-700`}
                          >
                            Pay when you receive
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue("delivery_type", "Online Delivery")
                          setFieldValue("payment_method", "bKash")
                        }}
                        style={tw.style(
                          "flex-1 p-3.5 rounded-2xl border flex-row items-center gap-2.5",
                          values.delivery_type === "Online Delivery"
                            ? {
                                backgroundColor: "#FEF2F2",
                                borderColor: "#C52405",
                              }
                            : {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              }
                        )}
                      >
                        <Ionicons
                          name={
                            values.delivery_type === "Online Delivery"
                              ? "radio-button-on"
                              : "radio-button-off"
                          }
                          size={18}
                          color={
                            values.delivery_type === "Online Delivery"
                              ? "#C52405"
                              : colors.mutedForeground
                          }
                        />
                        <View style={tw`flex-1`}>
                          <Text
                            style={tw.style("text-xs font-bold", {
                              color: colors.text,
                            })}
                          >
                            Online Delivery
                          </Text>
                          <Text
                            style={tw`text-[11px] font-semibold text-red-600`}
                          >
                            Pay online instantly
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Payment Method Details */}
                    <View style={tw`gap-2.5 mt-1`}>
                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue("payment_method", "COD")
                          setFieldValue("delivery_type", "Cash on Delivery")
                        }}
                        style={tw.style(
                          "p-3.5 rounded-2xl border flex-row items-center justify-between",
                          values.payment_method === "COD"
                            ? {
                                backgroundColor: "#FEF2F2",
                                borderColor: "#C52405",
                              }
                            : {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              }
                        )}
                      >
                        <View style={tw`flex-row items-center gap-3`}>
                          <Ionicons
                            name={
                              values.payment_method === "COD"
                                ? "radio-button-on"
                                : "radio-button-off"
                            }
                            size={18}
                            color={
                              values.payment_method === "COD"
                                ? "#C52405"
                                : colors.mutedForeground
                            }
                          />
                          <View>
                            <Text
                              style={tw.style("text-xs font-bold", {
                                color: colors.text,
                              })}
                            >
                              Cash on Delivery
                            </Text>
                            <Text
                              style={tw.style("text-[11px]", {
                                color: colors.mutedForeground,
                              })}
                            >
                              Pay after receiving your product
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name="cash-outline"
                          size={22}
                          color="#16A34A"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue("payment_method", "bKash")
                          setFieldValue("delivery_type", "Online Delivery")
                        }}
                        style={tw.style(
                          "p-3.5 rounded-2xl border flex-row items-center justify-between",
                          values.payment_method === "bKash"
                            ? {
                                backgroundColor: "#FEF2F2",
                                borderColor: "#C52405",
                              }
                            : {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              }
                        )}
                      >
                        <View style={tw`flex-row items-center gap-3`}>
                          <Ionicons
                            name={
                              values.payment_method === "bKash"
                                ? "radio-button-on"
                                : "radio-button-off"
                            }
                            size={18}
                            color={
                              values.payment_method === "bKash"
                                ? "#C52405"
                                : colors.mutedForeground
                            }
                          />
                          <View>
                            <Text
                              style={tw.style("text-xs font-bold", {
                                color: colors.text,
                              })}
                            >
                              bKash / Nagad / Rocket (Mobile Banking)
                            </Text>
                            <Text
                              style={tw.style("text-[11px]", {
                                color: colors.mutedForeground,
                              })}
                            >
                              Instant online payment
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name="phone-portrait-outline"
                          size={22}
                          color="#D97706"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue("payment_method", "Card")
                          setFieldValue("delivery_type", "Online Delivery")
                        }}
                        style={tw.style(
                          "p-3.5 rounded-2xl border flex-row items-center justify-between",
                          values.payment_method === "Card"
                            ? {
                                backgroundColor: "#FEF2F2",
                                borderColor: "#C52405",
                              }
                            : {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              }
                        )}
                      >
                        <View style={tw`flex-row items-center gap-3`}>
                          <Ionicons
                            name={
                              values.payment_method === "Card"
                                ? "radio-button-on"
                                : "radio-button-off"
                            }
                            size={18}
                            color={
                              values.payment_method === "Card"
                                ? "#C52405"
                                : colors.mutedForeground
                            }
                          />
                          <View>
                            <Text
                              style={tw.style("text-xs font-bold", {
                                color: colors.text,
                              })}
                            >
                              Debit / Credit Card
                            </Text>
                            <Text
                              style={tw.style("text-[11px]", {
                                color: colors.mutedForeground,
                              })}
                            >
                              Visa, Mastercard, AMEX
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name="card-outline"
                          size={22}
                          color="#2563EB"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* SECTION 4: PAYMENT SUMMARY */}
                    <View
                      style={tw.style("p-5 rounded-3xl border mt-3", {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      })}
                    >
                      <Text
                        style={tw.style(
                          "text-base font-bold mb-3 pb-2 border-b",
                          {
                            color: colors.text,
                            borderBottomColor: colors.border,
                          }
                        )}
                      >
                        Payment Summary
                      </Text>

                      <View style={tw`flex-row justify-between mb-2`}>
                        <Text
                          style={tw.style("text-sm", {
                            color: colors.mutedForeground,
                          })}
                        >
                          Subtotal
                        </Text>
                        <Text
                          style={tw.style("text-sm font-semibold", {
                            color: colors.text,
                          })}
                        >
                          ৳ {subtotal.toLocaleString()}
                        </Text>
                      </View>

                      <View style={tw`flex-row justify-between mb-2`}>
                        <Text
                          style={tw.style("text-sm", {
                            color: colors.mutedForeground,
                          })}
                        >
                          Delivery Charge (
                          {values.district === "Dhaka"
                            ? "Inside Dhaka"
                            : "Outside Dhaka"}
                          )
                        </Text>
                        <Text style={tw`text-sm font-semibold text-red-600`}>
                          + ৳ {deliveryCharge}
                        </Text>
                      </View>

                      <View
                        style={tw.style(
                          "flex-row justify-between pt-3 border-t mt-1",
                          { borderTopColor: colors.border }
                        )}
                      >
                        <Text
                          style={tw.style("text-base font-bold", {
                            color: colors.text,
                          })}
                        >
                          Total Amount
                        </Text>
                        <Text style={tw`text-xl font-bold text-red-600`}>
                          ৳ {total.toLocaleString()}
                        </Text>
                      </View>
                    </View>

                    {/* SUBMIT BUTTON */}
                    <View style={tw`pt-4`}>
                      {/* <Button
                        label={`Confirm Order (৳ ${total.toLocaleString()})`}
                        loading={isSubmitting}
                        onPress={() => handleSubmit()}
                        icon="checkmark-circle-outline"
                      /> */}
                    </View>
                  </View>
                </ScrollView>
              )
            }}
          </Formik>
        </Screen>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
