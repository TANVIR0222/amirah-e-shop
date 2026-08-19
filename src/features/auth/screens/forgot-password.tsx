import { router } from "expo-router"

import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainButton from "@/components/ui/MainButton"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"

import { Formik } from "formik"
import { View } from "react-native"
import {
  loginValidationSchema,
  resetPasswordValidationSchema,
} from "../validations/auth-validation-schema"
import { useUserForgotPasswordMutation } from "../api/auth-api"
import { appToast } from "@/lib/toast/app-toast"

export default function ForgotPasswordScreen() {
  const [userForgotPassword, { isLoading }] = useUserForgotPasswordMutation()

  return (
    <KeyboardAvoidingWrapper>
      <Screen scroll={false} contentStyle={{ justifyContent: "center" }}>
        <HeroPanel
          eyebrow="Login"
          title="Welcome back."
          body="Use the mock form to enter the starter app."
        />
        <Card>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={async (data) => {
              try {
                const response = await userForgotPassword(data).unwrap()
                if (response?.success && response?.data) {
                  appToast.success(
                    response?.message || "Registration successful!"
                  )
                  router.push({
                    pathname: "/(auth)/otp-verification",
                    params: {
                      email: data.email,
                      from: "forgot-password",
                    },
                  })
                } else {
                  appToast.error(response?.message || "Registration failed")
                }
              } catch (error: any) {
                // Extract field-level validation errors (e.g. { phone: ["already taken"] })
                const fieldErrors: Record<string, string[]> | undefined =
                  error?.errors

                console.log(fieldErrors)

                const errorMessage = fieldErrors
                  ? Object.values(fieldErrors).flat().join("\n")
                  : error?.data?.message ||
                    "Registration failed. Please check your credentials."

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
            }) => (
              <View style={tw`flex-col  justify-between `}>
                {/* 🔹 Input Fields */}
                <View style={tw` `}>
                  <MainInput
                    label="Email Address"
                    placeholder="Enter Your Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={() => handleBlur("email")}
                    error={errors.email}
                    touched={touched.email}
                  />
                </View>
                <View style={tw`flex-col gap-6`}>
                  {/* Log In Button */}
                  <MainButton
                    title={"Continue"}
                    // onPress={() => router.push("/(auth)/otp-verification")}
                    onPress={() => handleSubmit()}
                    isLoading={isLoading}
                    textStyle={tw`text-white`}
                    showSignUpLink={false}
                  />
                </View>
              </View>
            )}
          </Formik>
        </Card>
      </Screen>
    </KeyboardAvoidingWrapper>
  )
}
