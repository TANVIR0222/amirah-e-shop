import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { Formik } from "formik"
import React from "react"
import { Alert, Image, Text, TouchableOpacity, View } from "react-native"

import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainButton from "@/components/ui/MainButton"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import { useSession } from "@/features/auth/auth-session"
import useAuthUserInfo from "@/hooks/use-auth-user-info"
import tw from "@/lib/tailwind"
import { appToast } from "@/lib/toast/app-toast"
import { useAppTheme } from "@/theme/theme-provider"
import * as ImagePicker from "expo-image-picker"
import { useUpdateProfileMutation } from "../api/profile-api"
import editProfileValidationSchema from "../validations/profile-validation-schema"

const BRAND_ORANGE = "#F0653A"

export default function EditProfileScreen() {
  const { user } = useSession()
  const { colors } = useAppTheme()
  const { name, phone, isLoading } = useAuthUserInfo()

  //
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [image, setImage] = React.useState<string | null>(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      )
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <KeyboardAvoidingWrapper>
      <Screen scroll={true} contentStyle={{ flexGrow: 1 }}>
        {/* Header Bar */}
        <View style={tw`flex-row items-center justify-between py-3 mb-4`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-zinc-800`}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
            Edit Profile
          </Text>
          <View style={tw`w-10`} />
        </View>

        {/* Avatar Container with Edit Camera Badge */}
        <View style={tw`items-center my-4`}>
          <View style={tw`relative`}>
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.85}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: `${BRAND_ORANGE}1A`,
                borderWidth: 3,
                borderColor: BRAND_ORANGE,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <Text
                  style={{
                    fontSize: 34,
                    fontWeight: "800",
                    color: BRAND_ORANGE,
                  }}
                >
                  {initials}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: BRAND_ORANGE,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.background,
              }}
              activeOpacity={0.8}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: colors.mutedForeground,
              marginTop: 10,
            }}
          >
            Tap camera to change photo
          </Text>
        </View>

        {/* Formik Form */}
        <Formik
          initialValues={{
            name: name ?? "User",
            phone: phone ?? "+8801700000000",
          }}
          validationSchema={editProfileValidationSchema}
          onSubmit={async (data) => {
            console.log("Updated Profile:", data)
            // router.back()
            try {
              const response = await updateProfile(data).unwrap()
              if (response?.success && response?.data) {
                appToast.success(
                  response?.message || "Profile updated successfully!"
                )
                router.back()
              } else {
                appToast.error(response?.message || "Failed to update profile")
              }
            } catch (error: any) {
              if (__DEV__) {
                console.error("Update profile failed:", error)
              }
              const errorMessage =
                error?.data?.message ||
                "Failed to update profile. Please try again."
              appToast.error(errorMessage)
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View style={tw`flex-1 justify-between pt-2 pb-6`}>
              <View>
                <MainInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={() => handleBlur("name")}
                  error={errors.name}
                  touched={touched.name}
                />

                <MainInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={() => handleBlur("phone")}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={tw`mt-6`}>
                <MainButton
                  title="Save Changes"
                  onPress={() => handleSubmit()}
                  isLoading={isSubmitting}
                  textStyle={tw`text-white font-bold`}
                  buttonStyle={{ backgroundColor: BRAND_ORANGE }}
                />
              </View>
            </View>
          )}
        </Formik>
      </Screen>
    </KeyboardAvoidingWrapper>
  )
}
