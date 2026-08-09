import { api } from "@/api/base-api/api"
import { CategoryPayload } from "@/types/api-paginated-payload"
import { PaginatedResponse } from "@/types/api-paginated-response"
import { ApiResponse } from "@/types/api-response"
import { tagTypes } from "@/types/rtk-tag-type"
import { Standard } from "../type/category-type"

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResponse<PaginatedResponse<Standard>>,
      CategoryPayload
    >({
      query: ({ page = 1, per_page = 1, id, search }) => ({
        url: `/products`,
        method: "GET",
        params: {
          page,
          per_page,
          category_id: id,
          search,
        },
      }),
      providesTags: [tagTypes.shop],
    }),
  }),
})

export const { useGetProductsQuery, useLazyGetProductsQuery } = categoryApi
