import { Card } from "@/components/ui/card"
import { HeroPanel } from "@/components/ui/hero-panel"
import KeyboardAvoidingWrapper from "@/components/ui/KeyboardAvoidingWrapper"
import MainButton from "@/components/ui/MainButton"
import { Screen } from "@/components/ui/screen"
import tw from "@/lib/tailwind"
import { router } from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { OtpInput } from "react-native-otp-entry"

export default function OtpVerificationScreen() {
  const [otpVerify, setOtpVerify] = React.useState<string>("")
  const [seconds, setSeconds] = React.useState(30)

  // const { email, from } = useLocalSearchParams<{
  //   email: string
  //   from?: string
  // }>()

  React.useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 10000)

    return () => clearInterval(timer)
  }, [seconds])

  const handleRestOTP = async () => {
    // try {
    //   const res = await resend_otp_email({
    //     email: email,
    //   }).unwrap()
    //   if (res?.status) {
    //     Alert.alert(
    //       "Success",
    //       "OTP has been sent successfully, check your email"
    //     )
    //     setOtpVerify("")
    //   }
    // } catch (error: any) {
    //   console.log(error?.message)
    // }
  }

  const handleOtpVerify = async () => {
    if (otpVerify.length === 6) {
      router.push("/(auth)/change-password")
    } else {
      router.push("/(auth)/change-password")
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

            <TouchableOpacity onPress={() => handleRestOTP()}>
              <Text style={tw`text-text_gray text-xs underline`}>
                Send code again
              </Text>
            </TouchableOpacity>
          </View>
          <MainButton
            title={"Continue"}
            onPress={handleOtpVerify}
            isLoading={false}
            textStyle={tw`text-white`}
            showSignUpLink={false}
          />
        </Card>
      </Screen>
    </KeyboardAvoidingWrapper>
  )
}
