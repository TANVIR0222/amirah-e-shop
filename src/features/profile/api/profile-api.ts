import { api } from "@/api/base-api/api"
import { tagTypes } from "@/types/rtk-tag-type"

export const authenticationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "GET",
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userRegister: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
  }),
})
export const {} = authenticationApi
