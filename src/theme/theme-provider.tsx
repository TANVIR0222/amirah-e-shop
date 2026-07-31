import { DefaultTheme, ThemeProvider } from "expo-router"
import { createContext, useContext, useMemo } from "react"

import { colors } from "@/theme/colors"
import { motion } from "@/theme/motion"
import { radius } from "@/theme/radius"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

export type ThemeMode = "system" | "light" | "dark"
export type ResolvedTheme = "light" | "dark"

type AppThemeContextValue = {
  colors: (typeof colors)["light"]
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  motion: typeof motion
  radius: typeof radius
  spacing: typeof spacing
  typography: typeof typography
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null)

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  function setMode(_nextMode: ThemeMode) {
    // App is locked to light mode
  }

  const value = useMemo(
    () => ({
      colors: colors.light,
      mode: "light" as ThemeMode,
      resolvedTheme: "light" as ResolvedTheme,
      setMode,
      motion,
      radius,
      spacing,
      typography,
    }),
    []
  )

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: value.colors.background,
      border: value.colors.border,
      card: value.colors.background,
      notification: value.colors.primary,
      primary: value.colors.primary,
      text: value.colors.text,
    },
  }

  return (
    <AppThemeContext.Provider value={value}>
      <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  )
}

export function useAppTheme() {
  const value = useContext(AppThemeContext)

  if (!value) {
    throw new Error("useAppTheme must be used inside AppThemeProvider")
  }

  return value
}
