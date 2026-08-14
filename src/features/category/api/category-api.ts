import { api } from "@/api/base-api/api"
import { CategoryPayload } from "@/types/api-paginated-payload"
import { PaginatedResponse } from "@/types/api-paginated-response"
import { ApiResponse } from "@/types/api-response"
import { tagTypes } from "@/types/rtk-tag-type"
import { CategoryResponse } from "@/features/home/types/home-api-type"
import { Standard } from "../type/category-type"

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategoryProducts: builder.query<
      ApiResponse<PaginatedResponse<Standard>>,
      CategoryPayload
    >({
      query: ({ page = 1, per_page = 1, id, search }) => {
        return {
          url: `/products`,
          method: "GET",
          params: {
            page,
            per_page,
            category_id: id,
            search,
          },
        }
      },
      providesTags: [tagTypes.shop],
    }),
    getCategory: builder.query<
      ApiResponse<PaginatedResponse<CategoryResponse>>,
      CategoryPayload
    >({
      query: ({ page = 1, per_page = 1000 }) => ({
        url: `/categories`,
        method: "GET",
        params: {
          page,
          per_page,
        },
      }),
      providesTags: [tagTypes.category],
    }),
  }),
})

export const {
  useGetCategoryProductsQuery,
  useLazyGetCategoryProductsQuery,
  useGetCategoryQuery,
} = categoryApi
