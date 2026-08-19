import { router } from "expo-router"

import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainButton from "@/components/ui/MainButton"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import { useUserChangePasswordMutation } from "@/features/auth/api/auth-api"
import { changePasswordalidationSchema } from "@/features/auth/validations/auth-validation-schema"
import tw from "@/lib/tailwind"
import { appToast } from "@/lib/toast/app-toast"
import { Formik } from "formik"
import { Text, TouchableOpacity, View } from "react-native"
import TopHeaderBar from "@/components/ui/top-header-bar"
import { Ionicons } from "@expo/vector-icons"
import { useAppTheme } from "@/theme/theme-provider"

export default function ProfileChangePasswordScreen() {
  const { colors } = useAppTheme()

  const [userChangePassword, { isLoading }] = useUserChangePasswordMutation()

  const handleChangePassword = async (data: any) => {
    try {
      // Map new_password to password if that's what backend expects,
      // but let's pass it as is, or adjust based on backend.
      // Usually backend expects current_password, password, password_confirmation
      const payload = {
        current_password: data.current_password,
        password: data.new_password,
        password_confirmation: data.new_password_confirmation,
      }

      const res = await userChangePassword(payload).unwrap()
      if (res?.success || res?.status) {
        appToast.success(res?.message || "Password changed successfully")
        router.back()
      } else {
        appToast.error(res?.message || "Failed to change password")
      }
    } catch (error: any) {
      console.log(error)

      const fieldErrors: Record<string, string[]> | undefined =
        error?.errors || error?.data?.errors
      const errorMessage = fieldErrors
        ? Object.values(fieldErrors).flat().join("\n")
        : error?.message ||
          error?.data?.message ||
          "Failed to change password. Please try again."

      appToast.error(errorMessage)
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <Screen scroll={false}>
        {/* Header Bar */}
        <View style={tw`flex-row items-center justify-between `}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`w-10 h-10 rounded-full items-center justify-center `}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
            Change Password
          </Text>
          <View style={tw`w-10`} />
        </View>

        <>
          <Formik
            initialValues={{
              current_password: "",
              new_password: "",
              new_password_confirmation: "",
            }}
            validationSchema={changePasswordalidationSchema}
            onSubmit={handleChangePassword}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={tw`flex-col justify-between`}>
                {/* 🔹 Input Fields */}
                <View style={tw` `}>
                  <View>
                    <MainInput
                      label="Current Password"
                      placeholder="********"
                      value={values.current_password}
                      onChangeText={handleChange("current_password")}
                      onBlur={() => handleBlur("current_password")}
                      error={errors.current_password}
                      touched={touched.current_password}
                      isPassword
                    />
                    <MainInput
                      label="New Password"
                      placeholder="********"
                      value={values.new_password}
                      onChangeText={handleChange("new_password")}
                      onBlur={() => handleBlur("new_password")}
                      error={errors.new_password}
                      touched={touched.new_password}
                      isPassword
                    />
                    <MainInput
                      label="Confirm New Password"
                      placeholder="********"
                      value={values.new_password_confirmation}
                      onChangeText={handleChange("new_password_confirmation")}
                      onBlur={() => handleBlur("new_password_confirmation")}
                      error={errors.new_password_confirmation}
                      touched={touched.new_password_confirmation}
                      isPassword
                    />
                  </View>
                </View>
                <View style={tw`flex-col gap-6 mt-4`}>
                  {/* Save Button */}
                  <MainButton
                    title={"Update Password"}
                    onPress={() => handleSubmit()}
                    isLoading={isLoading}
                    textStyle={tw`text-white`}
                    showSignUpLink={false}
                  />
                </View>
              </View>
            )}
          </Formik>
        </>
      </Screen>
    </KeyboardAvoidingWrapper>
  )
}
