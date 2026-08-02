import { tagTypesList } from "@/types/rtk-tag-type"
import { createApi } from "@reduxjs/toolkit/query"
import { baseQueryWithRath } from "./base-api"

// Define the `createApi` with appropriate types
export const api = createApi({
  reducerPath: "v1/",
  baseQuery: baseQueryWithRath,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
})
