// ── Shared Generic Types ─────────────────────────────

// ── Domain Models ────────────────────────────────────

export interface StandardCategory {
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

export interface StandardBrand {
  id: number
  title: string
  image: any | null
  page_title: number | null
  short_description: string | null
  slug: string
  is_active: number
  created_at: string
  updated_at: string
}

export interface Standard {
  id: number
  name: string
  slug: string
  tags: any | null
  code: string
  type: string
  barcode_symbology: string
  brand_id: number
  category_id: number
  unit_id: number
  purchase_unit_id: number
  sale_unit_id: number
  cost: number
  price: number
  wholesale_price: number | null
  qty: number
  alert_quantity: any | null
  daily_sale_objective: any | null
  promotion: any | null
  promotion_price: number | null
  starting_date: string | null
  last_date: string | null
  tax_id: number | null
  tax_method: number
  image: string[]
  file: any | null
  is_embeded: boolean | null
  is_variant: boolean | null
  is_batch: boolean | null
  is_diffPrice: number | null
  is_imei: boolean | null
  featured: any | null
  is_online: number
  in_stock: number
  track_inventory: number
  product_list: any | null
  variant_list: any | null
  qty_list: any | null
  price_list: number | null
  product_details: string
  short_description: string | null
  specification: any | null
  meta_title: any | null
  meta_description: string | null
  related_products: any | null
  variant_option: any | null
  variant_value: any | null
  is_active: number
  guarantee: any | null
  warranty: any | null
  guarantee_type: string
  warranty_type: string
  is_sync_disable: boolean | null
  woocommerce_product_id: number | null
  woocommerce_media_id: number | null
  created_at: string
  updated_at: string
  category: StandardCategory
  brand: StandardBrand
}

export interface CategoryApiResponse {
  success: boolean
  message: string
  data: {
    current_page: number
    data: {
      id: number
      name: string
      slug: string
      tags: null | string
      code: string
      type: string
      barcode_symbology: string
      brand_id: number
      category_id: number
      unit_id: number
      purchase_unit_id: number
      sale_unit_id: number
      cost: number
      price: number
      wholesale_price: null | number
      qty: number
      alert_quantity: null
      daily_sale_objective: null
      promotion: null
      promotion_price: null
      starting_date: null
      last_date: null
      tax_id: null
      tax_method: number
      image: string[]
      file: null
      is_embeded: null | number
      is_variant: null
      is_batch: null
      is_diffPrice: null | number
      is_imei: null
      featured: null | number
      is_online: number
      in_stock: number
      track_inventory: number
      product_list: null
      variant_list: null
      qty_list: null
      price_list: null
      product_details: string
      short_description: null
      specification: null
      meta_title: null
      meta_description: null
      related_products: null | string
      variant_option: null
      variant_value: null
      is_active: number
      guarantee: null
      warranty: null
      guarantee_type: string | null
      warranty_type: string | null
      is_sync_disable: null
      woocommerce_product_id: null
      woocommerce_media_id: null
      created_at: string
      updated_at: string
      category: {
        id: number
        name: string
        image: string
        parent_id: number
        page_title: null
        short_description: null
        slug: string
        icon: null
        featured: number
        is_active: number
        woocommerce_category_id: null
        is_sync_disable: null
        created_at: string
        updated_at: string
      }
      brand: {
        id: number
        title: string
        image: null
        page_title: null
        short_description: null
        slug: string
        is_active: number
        created_at: string
        updated_at: string
      } | null
    }[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: {
      url: null | string
      label: string
      active: boolean
    }[]
    next_page_url: null
    path: string
    per_page: number
    prev_page_url: null
    to: number
    total: number
  }
}

// ── Response Type ─────────────────────────────────────

// export type ApiResult = ApiResponse<PaginatedResponse<Standard>>;
