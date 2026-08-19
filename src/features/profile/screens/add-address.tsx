import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Picker } from "@react-native-picker/picker"
import { router } from "expo-router"
import { Formik } from "formik"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

import useZoneLocation from "@/features/checkout/hook/use-zone-location"
import MainButton from "@/components/ui/MainButton"
import { addAddressValidationSchema } from "../schema/add-address-validations-schema"
import { useAddUserAddressMutation } from "../api/profile-api"
import { appToast } from "@/lib/toast/app-toast"

export default function AddAddressScreen() {
  const { colors } = useAppTheme()
  const { data: zoneLocations = [], isLoading: isZoneLoading } =
    useZoneLocation()
  const [addUserAddress, { isLoading }] = useAddUserAddressMutation()

  const handleSaveAddress = async (data: any) => {
    try {
      const payload = {
        type: data.label,
        full_name: data.full_name,
        phone_number: data.phone_number,
        district: data.district,
        area: data.area,
        building_street: data.house_no,
        full_address: data.full_address,
      }

      const res = await addUserAddress(payload).unwrap()

      appToast.success(res?.message || "Address saved successfully")
      router.back()
    } catch (error: any) {
      appToast.error(error?.message || "Something went wrong")
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <Screen scroll={false}>
        {/* Header Bar */}
        <View style={tw`flex-row items-center justify-between  mb-4`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`w-10 h-10 rounded-full items-center justify-center`}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
            Add New Address
          </Text>
          <View style={tw`w-10`} />
        </View>

        <Formik
          initialValues={{
            label: "Home",
            full_name: "",
            phone_number: "",
            district: "",
            area: "",
            house_no: "",
            full_address: "",
          }}
          validationSchema={addAddressValidationSchema}
          onSubmit={handleSaveAddress}
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
            return (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-10  gap-4`}
                style={tw`flex-1`}
              >
                {/* Personal Information */}
                <Text
                  style={tw.style("text-base font-bold", {
                    color: colors.text,
                  })}
                >
                  Personal Information
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

                {/* Address Details */}
                <Text
                  style={tw.style("text-base font-bold mt-2", {
                    color: colors.text,
                  })}
                >
                  Address Details
                </Text>

                {/* District & Area Pickers */}
                {(() => {
                  const activeDistrictObj = zoneLocations?.find(
                    (d) =>
                      d.name.toLowerCase() ===
                      String(values.district || "").toLowerCase()
                  )
                  const currentAreas = activeDistrictObj?.areas ?? []

                  return (
                    <View style={tw`flex-col gap-3`}>
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
                            onValueChange={(itemValue) => {
                              setFieldValue("district", itemValue)
                              const matching = zoneLocations?.find(
                                (d) =>
                                  d.name.toLowerCase() ===
                                  String(itemValue || "").toLowerCase()
                              )
                              const firstArea = matching?.areas?.[0] || ""
                              setFieldValue("area", firstArea)
                            }}
                          >
                            <Picker.Item
                              label={
                                isZoneLoading
                                  ? "Loading districts..."
                                  : "Select District"
                              }
                              value=""
                            />
                            {zoneLocations.map((item) => (
                              <Picker.Item
                                key={item.id || item.name}
                                label={item.name}
                                value={item.name}
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
                            enabled={Boolean(
                              values.district && currentAreas.length > 0
                            )}
                            onValueChange={(itemValue) =>
                              setFieldValue("area", itemValue)
                            }
                          >
                            <Picker.Item
                              label={
                                !values.district
                                  ? "Select District first"
                                  : currentAreas.length === 0
                                    ? "No areas found"
                                    : "Select Area"
                              }
                              value=""
                            />
                            {currentAreas.map((item) => (
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
                  )
                })()}

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

                {/* Save Button */}
                <MainButton
                  title="Save Address"
                  onPress={() => handleSubmit()}
                  textStyle={tw`text-white`}
                  showSignUpLink={false}
                  isLoading={isLoading}
                />
              </ScrollView>
            )
          }}
        </Formik>
      </Screen>
    </KeyboardAvoidingWrapper>
  )
}
