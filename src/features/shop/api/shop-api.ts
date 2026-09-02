import { api } from "@/api/base-api/api"
import { CategoryPayload } from "@/types/api-paginated-payload"
import { PaginatedResponse } from "@/types/api-paginated-response"
import { ApiResponse } from "@/types/api-response"
import { tagTypes } from "@/types/rtk-tag-type"
import SingleDataGetType from "@/types/single-data-get-with-id-type"
import {
  CouponInterface,
  ShopProductListResponse,
  ShopProductResponse,
} from "../types/shop-type"

export const shopApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResponse<PaginatedResponse<ShopProductResponse>>,
      CategoryPayload
    >({
      query: ({ page = 1, per_page, search }) => ({
        url: "/products",
        method: "GET",
        params: {
          page,
          per_page,
          search,
        },
      }),

      providesTags: [tagTypes.shop],
    }),
    getSingleProduct: builder.query<ShopProductListResponse, SingleDataGetType>(
      {
        query: ({ id }) => ({
          url: `/products/${id}`,
        }),
        providesTags: [tagTypes.shop],
      }
    ),
    getRelatedProducts: builder.query<
      ApiResponse<PaginatedResponse<ShopProductResponse>>,
      CategoryPayload
    >({
      query: ({ page = 1, per_page = 1, id }) => ({
        url: `products/${id}/related`,
        method: "GET",
        params: {
          page,
          per_page,
        },
      }),
      providesTags: [tagTypes.shop],
    }),
    validateCoupon: builder.mutation<
      ApiResponse<PaginatedResponse<ShopProductResponse>>,
      CouponInterface
    >({
      query: (data) => ({
        url: `/coupons/validate`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.shop],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetSingleProductQuery,
  useGetRelatedProductsQuery,
  useLazyGetRelatedProductsQuery,
  useValidateCouponMutation,
} = shopApi
