import { Stack } from "expo-router/stack"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { AppToaster } from "@/components/ui/app-toaster"
import { DraggableFloatingCart } from "@/components/ui/draggable-floating-cart"
import { useSession } from "@/features/auth/auth-session"
import { AppProviders } from "@/providers/app-providers"
import { useAppTheme } from "@/theme/theme-provider"

function RootNavigator() {
  const { hasHydrated, isSignedIn } = useSession()
  const { resolvedTheme } = useAppTheme()

  if (!hasHydrated) {
    return <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
  }

  return (
    <>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="product" />
          <Stack.Screen name="(all-order-info)" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="(common)" />
          <Stack.Screen name="category" />
          <Stack.Screen name="cart" />
          <Stack.Screen
            name="(modal)/order-summery-modal"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.5, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: 24,
              sheetLargestUndimmedDetentIndex: -1,
            }}
          />
          <Stack.Screen
            name="(modal)/order-filter-modal"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.6, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: 24,
              sheetLargestUndimmedDetentIndex: -1,
            }}
          />
        </Stack.Protected>
      </Stack>

      {/* ── Global Draggable Floating Cart ── */}
      {isSignedIn && <DraggableFloatingCart />}
    </>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <RootNavigator />
        <AppToaster />
      </AppProviders>
    </GestureHandlerRootView>
  )
}
