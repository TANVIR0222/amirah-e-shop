import { AppText } from "@/components/ui/app-text"
import { Button } from "@/components/ui/button"
import { Screen } from "@/components/ui/screen"
import { router } from "expo-router"
import { Image, View } from "react-native"
import tw from "../../../lib/tailwind"
import { useUserGuestLoginMutation } from "../api/auth-api"
import { useSession } from "../auth-session"

export default function WelcomeScreen() {
  const [userGuestLogin, { isLoading }] = useUserGuestLoginMutation()
  const { signIn } = useSession()

  const handleGuestLogin = async () => {
    try {
      const response = await userGuestLogin({
        device_id: `881D3405-65AC-11E7-${Date.now()}-A01CE40260D1`,
      }).unwrap()

      if (response?.data) {
        signIn(response.data)
        router.replace("/(drawer)/(tabs)")
      }
    } catch (error) {
      console.error("Error during guest login:", error)
    }
  }

  return (
    <Screen
      scroll={false}
      contentStyle={tw`flex-1 bg-primaryBg items-center justify-center px-6`}
    >
      <Image
        source={require("@/assets/images/wel-come-image.jpg")}
        style={tw`w-72 h-72`}
        resizeMode="cover"
      />

      <View style={tw`mt-12 w-full items-center`}>
        <AppText variant="title" style={tw`text-center text-primaryText`}>
          Find Everything You Love
        </AppText>

        <AppText
          tone="muted"
          style={tw`mt-3 text-center text-base leading-6 px-4`}
        >
          Discover trendy fashion, premium accessories, and beauty essentials—
          all in one place.
        </AppText>

        <View style={tw`w-full mt-10 gap-4`}>
          <Button
            label="Log In"
            variant="orange"
            onPress={() => router.push("/(auth)/login")}
          />

          <Button
            label="Continue"
            variant="outline"
            onPress={handleGuestLogin}
            disabled={isLoading}
            loading={isLoading}
          />
        </View>
      </View>
    </Screen>
  )
}
