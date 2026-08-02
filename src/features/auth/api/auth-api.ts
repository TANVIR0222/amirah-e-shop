import { api } from "@/api/base-api/api"
import { tagTypes } from "@/types/rtk-tag-type"

export const authenticationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userRegister: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userVerify: builder.mutation({
      query: (data) => ({
        url: "/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/resend-verification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userLogout: builder.mutation<any, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.auth],
    }),
  }),
})
export const {} = authenticationApi
