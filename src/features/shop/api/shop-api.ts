import { api } from "@/api/base-api/api"
import { CategoryPayload } from "@/types/api-paginated-payload"
import { PaginatedResponse } from "@/types/api-paginated-response"
import { ApiResponse } from "@/types/api-response"
import { tagTypes } from "@/types/rtk-tag-type"
import SingleDataGetType from "@/types/single-data-get-with-id-type"
import { ShopProductResponse } from "../types/shop-type"

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResponse<PaginatedResponse<ShopProductResponse>>,
      CategoryPayload
    >({
      query: ({ page = 1, per_page = 1 }) => ({
        url: "/products",
        method: "GET",
        params: {
          page,
          per_page,
        },
      }),

      providesTags: [tagTypes.category],
    }),
    getSingleProduct: builder.query<
      ApiResponse<ShopProductResponse>,
      SingleDataGetType
    >({
      query: ({ id }) => ({
        url: `/products/${id}`,
      }),
      providesTags: [tagTypes.category],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetSingleProductQuery,
} = categoryApi
