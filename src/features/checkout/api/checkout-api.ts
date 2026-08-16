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
    submitOrder: builder.mutation<void, any>({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),
    deliveryChargerCalculate: builder.mutation<void, any>({
      query: (data) => ({
        url: "/checkout/calculate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),
  }),
})

export const {
  useGetZoneQuery,
  useSubmitOrderMutation,
  useDeliveryChargerCalculateMutation,
} = checkoutApi
