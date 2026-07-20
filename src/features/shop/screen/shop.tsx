import { AppText } from "@/components/ui/app-text"
import GlobalSearch from "@/components/ui/global-search"
import { Screen } from "@/components/ui/screen"
import HomeItemsCard from "@/features/home/components/home-items-card"
import React from "react"

export default function Shop() {
  const [search, setSearch] = React.useState<string>("")

  return (
    <Screen>
      <AppText variant="title">Shop</AppText>

      <GlobalSearch
        placeholder="Search courses"
        value={search}
        onChangeText={setSearch}
      />
      <HomeItemsCard />
    </Screen>
  )
}
