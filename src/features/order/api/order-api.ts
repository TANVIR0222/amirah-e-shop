import { api } from "@/api/base-api/api"
import { tagTypes } from "@/types/rtk-tag-type"
import { CategoryPayload } from "@/types/api-paginated-payload"
import { ApiResult } from "../type/order-type"

export const shopApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllInfoOrder: builder.query<ApiResult, CategoryPayload>({
      query: ({ page = 1, per_page = 1, status }) => ({
        url: "/orders",
        method: "GET",
        params: {
          page,
          per_page,
          status,
        },
      }),

      providesTags: [tagTypes.orders],
    }),
  }),
})

export const { useGetAllInfoOrderQuery, useLazyGetAllInfoOrderQuery } = shopApi
