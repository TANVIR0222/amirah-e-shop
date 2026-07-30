import { router } from "expo-router"

import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import MainButton from "@/components/ui/MainButton"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import { useSession } from "@/features/auth/auth-session"
import { useAuthForm } from "@/features/auth/hooks/use-auth-form"
import tw from "@/lib/tailwind"
import { Checkbox } from "expo-checkbox"

import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import { Formik } from "formik"
import { Text, View } from "react-native"
import { registerValidationSchema } from "../validations/auth-validation-schema"

export default function SignupScreen() {
  const { signIn } = useSession()
  const { email, password, setEmail, setPassword, isValid } = useAuthForm("")

  function handleSubmit() {
    if (!isValid) return
    signIn(email)
    router.replace("/")
  }

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
              password: "",
              password_confirmation: "",
              checkbox: false,
              full_name: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={() => {}}
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
                    <MainInput
                      label="Confirm Password"
                      placeholder="********"
                      value={values.password_confirmation}
                      onChangeText={handleChange("password_confirmation")}
                      onBlur={() => handleBlur("password_confirmation")}
                      error={errors.password_confirmation}
                      touched={touched.password_confirmation}
                      isPassword
                    />
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
                        color={values.checkbox ? "#2D8CFF" : "#C4C4C4"}
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
                    isLoading={false}
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
