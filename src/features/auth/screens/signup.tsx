import { router } from "expo-router"

import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import MainButton from "@/components/ui/MainButton"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { Checkbox } from "expo-checkbox"

import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import { appToast } from "@/lib/toast/app-toast"
import { Formik } from "formik"
import { Text, View } from "react-native"
import { useUserRegisterMutation } from "../api/auth-api"
import { registerValidationSchema } from "../validations/auth-validation-schema"

export default function SignupScreen() {
  const [userRegister, { isLoading }] = useUserRegisterMutation()

  return (
    <KeyboardAvoidingWrapper>
      <Screen scroll={false} contentStyle={{ justifyContent: "center" }}>
        <HeroPanel
          eyebrow="Signup"
          title="Create your workspace."
          body="Replace this mock flow with your real authentication provider."
        />
        <Card>
          <Formik
            initialValues={{
              email: "",
              phone: "",
              password: "",
              // password_confirmation: "",
              checkbox: false,
              full_name: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={async (data) => {
              // Handle form submission here
              // console.log("Form data:", data)
              const { full_name, email, phone, password } = data

              const payload = {
                name: full_name,
                email,
                phone,
                password,
                is_active: 1, // Assuming active by default
                role_id: "2", // Assuming a default role ID
              }

              try {
                const response = await userRegister(payload).unwrap()
                if (response?.success && response?.data) {
                  appToast.success(
                    response?.message || "Registration successful!"
                  )
                  router.replace("/(auth)/login")
                } else {
                  appToast.error(response?.message || "Registration failed")
                }
              } catch (error: any) {
                if (__DEV__) {
                  console.error("Registration failed:", error)
                }
                const errorMessage =
                  error?.data?.message ||
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
              setFieldValue,
              setFieldTouched,
            }) => (
              <View style={tw`flex-col  justify-between `}>
                {/* 🔹 Input Fields */}
                <View style={tw` `}>
                  <MainInput
                    label="Full Name"
                    placeholder="Enter Your Full Name"
                    value={values.full_name}
                    onChangeText={handleChange("full_name")}
                    onBlur={() => handleBlur("full_name")}
                    error={errors.full_name}
                    touched={touched.full_name}
                  />
                  <MainInput
                    label="Email Address"
                    placeholder="Enter Your Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={() => handleBlur("email")}
                    error={errors.email}
                    touched={touched.email}
                    keyboardType="email-address"
                  />

                  <MainInput
                    label="Phone Number"
                    placeholder="01XXXXXXXXX"
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    onBlur={() => handleBlur("phone")}
                    error={errors.phone}
                    touched={touched.phone}
                    keyboardType="phone-pad"
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
                    {/* <MainInput
                      label="Confirm Password"
                      placeholder="********"
                      value={values.password_confirmation}
                      onChangeText={handleChange("password_confirmation")}
                      onBlur={() => handleBlur("password_confirmation")}
                      error={errors.password_confirmation}
                      touched={touched.password_confirmation}
                      isPassword
                    /> */}
                  </View>
                </View>
                <View style={tw`flex-col gap-6`}>
                  {/* Options Row */}
                  <View>
                    <View style={tw`flex-row items-center`}>
                      <Checkbox
                        value={values.checkbox}
                        onValueChange={(value) => {
                          setFieldValue("checkbox", value)
                        }}
                        color={values.checkbox ? "#F0653A" : "#C4C4C4"}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                        }}
                      />

                      <Text style={tw`text-text_gray text-xs ml-2`}>
                        I agree to the Terms & Conditions
                      </Text>
                    </View>

                    {touched.checkbox && errors.checkbox && (
                      <Text style={tw`text-red text-xs mt-1`}>
                        {errors.checkbox}
                      </Text>
                    )}
                  </View>

                  {/* Log In Button */}
                  <MainButton
                    title={"Sign up"}
                    onPress={() => handleSubmit()}
                    isLoading={isLoading}
                    textStyle={tw`text-white`}
                    showSignUpLink={true}
                    signUpPrompt="Already have an account?"
                    signUpText="Sign in"
                    onSignUpPress={() => router.push("/(auth)/login")}
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
