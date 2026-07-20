import { useAppTheme } from "@/theme/theme-provider"
import { Stack } from "expo-router"

export default function ProductLayout() {
  const { colors } = useAppTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  )
}
