import { router } from "expo-router"

import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainButton from "@/components/ui/MainButton"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { Checkbox } from "expo-checkbox"

import { appToast } from "@/lib/toast/app-toast"
import { Formik } from "formik"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useUserLoginMutation } from "../api/auth-api"
import { useSession } from "../auth-session"
import { loginValidationSchema } from "../validations/auth-validation-schema"

export default function LoginScreen() {
  const [rememberMe, setRememberMe] = React.useState(false)
  const { signIn } = useSession()

  // ------ api call for login ------------
  const [userLogin, { isLoading }] = useUserLoginMutation()

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
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={async (data) => {
              try {
                const response = await userLogin(data).unwrap()
                if (response?.success && response?.data) {
                  signIn(response.data)
                  appToast.success(response?.message || "Login successful!")
                  router.replace("/(drawer)/(tabs)")
                } else {
                  appToast.error(response?.message || "Login failed")
                }
              } catch (error: any) {
                if (__DEV__) {
                  console.error("Login failed:", error)
                }
                const errorMessage =
                  error?.data?.message ||
                  "Login failed. Please check your credentials."
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

                  <View>
                    <MainInput
                      label="Password"
                      placeholder="********"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={() => handleBlur("password")}
                      error={errors.password}
                      touched={touched.password}
                      isPassword
                    />
                  </View>
                </View>
                <View style={tw`flex-col gap-6`}>
                  {/* Options Row */}
                  <View style={tw`flex-row justify-between items-center `}>
                    <View style={tw`flex-row items-center`}>
                      <Checkbox
                        value={rememberMe}
                        onValueChange={setRememberMe}
                        color={rememberMe ? "#F0653A" : "#C4C4C4"}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                        }}
                      />

                      <Text style={tw`text-text_gray text-xs ml-2`}>
                        Remember me
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => router.push("/(auth)/forgot-password")}
                    >
                      <Text style={tw`text-text_gray text-xs underline`}>
                        Forgot password
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Log In Button */}
                  <MainButton
                    title={"Log in"}
                    onPress={() => handleSubmit()}
                    isLoading={isLoading}
                    textStyle={tw`text-white`}
                    showSignUpLink={true}
                    signUpPrompt="Don’t have an account?"
                    signUpText="Register"
                    onSignUpPress={() => router.push("/(auth)/signup")}
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
