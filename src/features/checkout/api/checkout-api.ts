import { api } from "@/api/base-api/api"
import { tagTypes } from "@/types/rtk-tag-type"
import { CheckoutResponse } from "../type/checkout-type"

export const checkoutApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getZone: builder.query<CheckoutResponse, void>({
      query: () => ({
        url: "/locations/districts",
      }),
      providesTags: [tagTypes.districts],
    }),
  }),
})

export const { useGetZoneQuery } = checkoutApi
