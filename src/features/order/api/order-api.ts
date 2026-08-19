import { api } from "@/api/base-api/api"
import { tagTypes } from "@/types/rtk-tag-type"
import { CategoryPayload } from "@/types/api-paginated-payload"
import {
  ApiResult,
  ProductReturnRespose,
  ReturnResponse,
  TrackOrderInfoAndLiveLocationRespose,
} from "../type/order-type"

export const shopApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllInfoOrder: builder.query<ApiResult, CategoryPayload>({
      query: ({ page = 1, per_page = 10, status }) => ({
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
    userOrderCanche: builder.mutation<ApiResult, string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.orders],
    }),
    trackOrderinfoAndLiveLocation: builder.query<
      TrackOrderInfoAndLiveLocationRespose,
      string
    >({
      query: (id) => ({
        url: `/orders/${id}/track-live`,
      }),
      providesTags: [tagTypes.orders],
    }),
    orderReturnRequest: builder.mutation<
      ProductReturnRespose,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/orders/${id}/return`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),
    returnRequestListByUser: builder.query<
      import("@/types/api-response").ApiResponse<
        import("@/types/api-paginated-response").PaginatedResponse<ReturnResponse>
      >,
      CategoryPayload
    >({
      query: ({ page = 1, per_page = 10 }) => ({
        url: `/returns`,
        method: "GET",
        params: {
          page,
          per_page,
        },
      }),
      providesTags: [tagTypes.orders],
    }),
  }),
})

export const {
  useLazyReturnRequestListByUserQuery,
  useReturnRequestListByUserQuery,
  useOrderReturnRequestMutation,
  useTrackOrderinfoAndLiveLocationQuery,
  useGetAllInfoOrderQuery,
  useLazyGetAllInfoOrderQuery,
  useUserOrderCancheMutation,
} = shopApi
