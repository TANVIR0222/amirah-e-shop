import { api } from "@/api/base-api/api"
import { PaginatedResponse } from "@/types/api-paginated-response"
import { ApiResponse } from "@/types/api-response"
import { tagTypes } from "@/types/rtk-tag-type"

import { CategoryPayload } from "@/types/api-paginated-payload"
import {
  BannerResponse,
  CategoryResponse,
  StandardBrand,
} from "../types/home-api-type"

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategories: builder.query<
      ApiResponse<PaginatedResponse<CategoryResponse>>,
      CategoryPayload
    >({
      query: ({ page = 1, per_page = 15 }) => ({
        url: "/categories",
        method: "GET",
        params: {
          page,
          per_page,
        },
      }),

      providesTags: [tagTypes.category],
    }),
    getHomeBanner: builder.query<ApiResponse<BannerResponse>, void>({
      query: () => ({
        url: "/banners",
      }),
      providesTags: [tagTypes.banner],
    }),
    getNewProducts: builder.query<ApiResponse<StandardBrand>, void>({
      query: () => ({
        url: "/products/new",
      }),
      providesTags: [tagTypes.new_product],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetHomeBannerQuery,
  useLazyGetHomeBannerQuery,
  useGetNewProductsQuery,
} = categoryApi
