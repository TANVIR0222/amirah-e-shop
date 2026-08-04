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
import { loginValidationSchema } from "../validations/auth-validation-schema"

export default function ForgotPasswordScreen() {
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
            onSubmit={() => router.push("/(auth)/otp-verification")}
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
                    onPress={() => router.push("/(auth)/otp-verification")}
                    isLoading={false}
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
