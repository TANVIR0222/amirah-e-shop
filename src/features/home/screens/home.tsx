import { AppText } from "@/components/ui/app-text"
import { Card } from "@/components/ui/card"
import GlobalSearch from "@/components/ui/global-search"
import { Screen } from "@/components/ui/screen"
import { SectionHeader } from "@/components/ui/section-header"
import { useSession } from "@/features/auth/auth-session"
import { useWorkspaceStore } from "@/features/workspace/workspace-store"
import { useHomeSummary } from "@/hooks/use-home-summary"
import { useI18n } from "@/i18n"
import { useAppTheme } from "@/theme/theme-provider"
import { router } from "expo-router"
import React from "react"
import HomeCarousel from "../components/home-carousel"
import HomeCategories from "../components/home-categories"
import HomeHeader from "../components/home-header"
import HomeItemsCard from "../components/home-items-card"

export default function HomeScreen() {
  const { user } = useSession()
  const { modules } = useWorkspaceStore()
  const { readyModules, plannedModules } = useHomeSummary(modules)
  const { locale, t } = useI18n()
  const { resolvedTheme } = useAppTheme()

  const [search, setSearch] = React.useState<string>("")

  return (
    <Screen>
      <HomeHeader />

      <GlobalSearch
        placeholder="Search courses"
        value={search}
        onChangeText={setSearch}
      />
      <HomeCarousel />
      <SectionHeader
        title="Categories"
        action="View All"
        onActionPress={() => router.push("/(tabs)/shop")}
      />
      <HomeCategories />
      <SectionHeader
        title="Categories"
        action="View All"
        onActionPress={() => router.push("/(tabs)/shop")}
      />
      <HomeItemsCard />
    </Screen>
  )
}
