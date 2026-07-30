import { router } from "expo-router"

import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainButton from "@/components/ui/MainButton"
import MainInput from "@/components/ui/MainInput"
import { Screen } from "@/components/ui/screen"
import { useSession } from "@/features/auth/auth-session"
import { useAuthForm } from "@/features/auth/hooks/use-auth-form"
import tw from "@/lib/tailwind"

import { Formik } from "formik"
import { View } from "react-native"
import { createNewPasswordValidationSchema } from "../validations/auth-validation-schema"

export default function ChangePasswordScreen() {
  const { signIn } = useSession()
  const { email, isValid } = useAuthForm()

  function handleSubmit() {
    if (!isValid) return
    signIn(email)
    router.replace("/")
  }

  return (
    <KeyboardAvoidingWrapper>
      <Screen scroll={false} contentStyle={{ justifyContent: "center" }}>
        <HeroPanel
          eyebrow="Change Password"
          title="Update Your Password"
          body="Create a strong password that you'll use the next time you sign in."
        />
        <Card>
          <Formik
            initialValues={{ password: "", password_confirmation: "" }}
            validationSchema={createNewPasswordValidationSchema}
            onSubmit={handleSubmit}
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
                  <View>
                    <MainInput
                      label="New Password"
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
                  {/* Log In Button */}
                  <MainButton
                    title={"Continue"}
                    onPress={() => router.push("/(drawer)/(tabs)")}
                    isLoading={false}
                    disabled={false}
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
