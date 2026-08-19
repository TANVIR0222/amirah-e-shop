import { api } from "@/api/base-api/api"
import { ApiResponse } from "@/types/api-response"
import { tagTypes } from "@/types/rtk-tag-type"
import {
  AddAddressResponse,
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
    userAddress: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => ({
        url: "/user/addresses",
      }),
      providesTags: [tagTypes.profile],
    }),
    updateProfile: builder.mutation<
      ApiResponse<ProfileUpdateResponse>,
      FormData
    >({
      query: (formData) => ({
        url: "/user/profile",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    addUserAddress: builder.mutation<ApiResponse<AddAddressResponse>, FormData>(
      {
        query: (payload) => ({
          url: "/user/addresses",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [tagTypes.profile],
      }
    ),
    deleteUserAddress: builder.mutation<
      ApiResponse<AddAddressResponse>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/user/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    updateUserAddress: builder.mutation<
      ApiResponse<AddAddressResponse>,
      { id: string; payload: any }
    >({
      query: ({ id, payload }) => ({
        url: `/user/addresses/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
  }),
})
export const {
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
  useUserProfileQuery,
  useUpdateProfileMutation,
  useUserAddressQuery,
  useAddUserAddressMutation,
} = authenticationApi
