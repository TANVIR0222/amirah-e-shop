import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainButton from "@/components/ui/MainButton"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import React from "react"
import { Alert, Text, TouchableOpacity, View } from "react-native"
import { OtpInput } from "react-native-otp-entry"
import {
  useOtpVerifyAndResetMutation,
  useResendOtpMutation,
} from "../api/auth-api"
import { router, useLocalSearchParams } from "expo-router"
import { appToast } from "@/lib/toast/app-toast"
import { string } from "yup"
import { useSession } from "../auth-session"
import { appStorage } from "@/lib/storage/app-storage"

export default function OtpVerificationScreen() {
  const [otpVerify, setOtpVerify] = React.useState<string>("")
  const [seconds, setSeconds] = React.useState(30)

  const { signIn } = useSession()

  const [otpVerifyAndReset, { isLoading, error }] =
    useOtpVerifyAndResetMutation()
  const [resendOtp, { isLoading: isResendLoading, error: isResendError }] =
    useResendOtpMutation()

  const { email, from } = useLocalSearchParams<{
    email: string
    from: string
  }>()

  console.log(from)

  React.useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 10000)

    return () => clearInterval(timer)
  }, [seconds])

  const handleRestOTP = async () => {
    try {
      await resendOtp({ email }).unwrap()
      appToast.success("OTP has been sent successfully, check your email")
      setOtpVerify("")
      setSeconds(30) // Reset the timer
    } catch (error: any) {
      const fieldErrors: Record<string, string[]> | undefined =
        error?.errors || error?.data?.errors
      const errorMessage = fieldErrors
        ? Object.values(fieldErrors).flat().join("\n")
        : error?.data?.message || error?.message || "Failed to resend OTP."

      appToast.error(errorMessage)
    }
  }

  const handleOtpVerify = async () => {
    if (!otpVerify || otpVerify.length < 6) {
      appToast.error("Please enter a valid 6-digit OTP.")
      return
    }

    try {
      const res = await otpVerifyAndReset({
        otp: otpVerify,
      }).unwrap()

      if (res) {
        // Save the temporary token to storage so the `change-password` API can use it.
        // We CANNOT call `signIn(res.data)` here because setting `isSignedIn=true`
        // tells Expo Router to immediately unmount the `(auth)` stack, breaking the navigation!
        const token = res.data?.access_token || res.data?.token
        if (token) {
          await appStorage.set("auth-token", token)
        }

        appToast.success(res?.message || "OTP verified successfully")
        if (from === "forgot-password") {
          router.push("/(auth)/change-password")
        } else {
          router.push("/(auth)/login")
        }
      } else {
        appToast.error(res?.message || "Verification failed")
      }
    } catch (error: any) {
      const fieldErrors: Record<string, string[]> | undefined =
        error?.errors || error?.data?.errors
      const errorMessage = fieldErrors
        ? Object.values(fieldErrors).flat().join("\n")
        : error?.data?.message ||
          error?.message ||
          "Verification failed. Please check your OTP."

      appToast.error(errorMessage)
    }
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
          <OtpInput
            focusColor="#F0653A"
            placeholder="000000"
            autoFocus={false}
            numberOfDigits={6}
            type="numeric"
            onFilled={(text: string) => setOtpVerify(text)}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            textProps={{
              accessibilityRole: "text",
              accessibilityLabel: "OTP digit",
              allowFontScaling: false,
            }}
            theme={{
              pinCodeTextStyle: {
                color: "#757575",
                fontSize: 20,
                fontFamily: "InterBold",
              },
              pinCodeContainerStyle: {
                borderColor: "#757575",
                borderWidth: 1,
                borderRadius: 100,
                width: 50,
                height: 50,
              },
            }}
          />
          <View style={tw`flex-row justify-between items-center `}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-text_gray text-xs ml-2`}>
                Resend ({seconds}s)
              </Text>
            </View>

            {/* <TouchableOpacity onPress={() => {}}> */}
            <TouchableOpacity onPress={() => handleRestOTP()}>
              <Text style={tw`text-text_gray text-xs underline`}>
                Send code again
              </Text>
            </TouchableOpacity>
          </View>
          <MainButton
            title={"Continue"}
            onPress={() => handleOtpVerify()}
            isLoading={isLoading}
            textStyle={tw`text-white`}
            showSignUpLink={false}
          />
        </Card>
      </Screen>
    </KeyboardAvoidingWrapper>
  )
}
