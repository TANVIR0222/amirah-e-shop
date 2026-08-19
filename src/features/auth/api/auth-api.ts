import { api } from "@/api/base-api/api"
import { tagTypes } from "@/types/rtk-tag-type"
import {
  UserLoginPayload,
  UserLoginResponse,
  UserRegisterPayload,
  UserRegisterResponse,
} from "../types"

export const authenticationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    userLogin: builder.mutation<UserLoginResponse, UserLoginPayload>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userRegister: builder.mutation<UserRegisterResponse, UserRegisterPayload>({
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
        url: "/resend-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    otpVerifyAndReset: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userForgotPassword: builder.mutation({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userChangePassword: builder.mutation({
      query: (data) => ({
        url: "/user/change-password",
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
export const {
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserVerifyMutation,
  useResendOtpMutation,
  useUserLogoutMutation,
  useUserForgotPasswordMutation,
  useOtpVerifyAndResetMutation,
  useUserChangePasswordMutation,
} = authenticationApi
