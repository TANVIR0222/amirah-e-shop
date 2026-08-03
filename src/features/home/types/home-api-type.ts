export interface CategoryResponse {
  id: number
  name: string
  image: string
  parent_id: number | null
  page_title: number | null
  short_description: string | null
  slug: string
  icon: string
  featured: number
  is_active: number
  woocommerce_category_id: number | null
  is_sync_disable: boolean | null
  created_at: string
  updated_at: string
}

export interface CategoryPayload {
  page: number
  per_page: number
}
