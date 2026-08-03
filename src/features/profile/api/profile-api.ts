import { api } from "@/api/base-api/api"
import { ApiResponse } from "@/types/api-response"
import { tagTypes } from "@/types/rtk-tag-type"
import {
  ProfileEditPayload,
  ProfileResponse,
  ProfileUpdateResponse,
} from "../types/profile-type"

export const authenticationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    userProfile: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => ({
        url: "/user/profile",
      }),
      providesTags: [tagTypes.profile],
    }),
    updateProfile: builder.mutation<
      ApiResponse<ProfileUpdateResponse>,
      ProfileEditPayload
    >({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
  }),
})
export const { useUserProfileQuery, useUpdateProfileMutation } =
  authenticationApi
