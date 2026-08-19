// ── Shared Generic Types ─────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: PaginatedResponse<T>
}

export interface PaginatedResponse<T> {
  status_counts: StatusCounts
  filter_status: string
  current_page: number
  last_page: number
  per_page: number
  total: number
  orders: T[]
}

// ── Domain Models ────────────────────────────────────

export interface OrderItem {
  product_id: number
  name: string
  code: string
  image: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: number
  reference_no: string
  date: string
  total_items: number
  total_qty: number
  grand_total: number
  paid_amount: number
  sale_status: string
  payment_status: string
  shipping_city: string
  items: OrderItem[]
}

export interface StatusCounts {
  all: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
}

// ── Response Type ─────────────────────────────────────

export type OrderResponse = ApiResponse<Order>

export type ApiResult = OrderResponse

export interface TrackOrderInfoAndLiveLocationRespose {
  success: boolean
  message: string
  data: {
    order_id: number
    reference_no: string
    is_live: boolean
    status: string
    status_text: string
    estimated_delivery_time: string
    estimated_mins_remaining: number
    assigned_rider: {
      name: string
      phone: string
      avatar: string
      vehicle_info: string
      rating: number
      total_deliveries: number
      current_location: {
        latitude: number
        longitude: number
        last_updated: string
      }
    }
    order_progress: {
      step: number
      title: string
      subtitle: string
      time: string
      is_completed: boolean
      is_current: boolean
    }[]
    delivery_address: {
      label: string
      full_name: string
      phone: string
      address: string
      city: string
    }
    summary: {
      subtotal: number
      delivery_charge: number
      discount: number
      grand_total: number
      paid_amount: number
    }
    items: {
      product_id: number
      name: string
      code: string
      image: string
      quantity: number
      unit_price: number
      total_price: number
      variant: string | null
    }[]
    support: {
      help_phone: string
      message: string
    }
  }
}

export interface ProductReturnRespose {
  success: boolean
  message: string
  data: {
    return_id: number
    reference_no: string
    order_id: number
    total_qty: number
    grand_total: number
    reason: string
    document_url: string | null
    created_at: string
  }
}

export interface DataModelItem {
  product_id: number
  name: string
  image: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface ReturnResponse {
  id: number
  reference_no: string
  order_id: number
  order_ref: string
  total_qty: number
  grand_total: number
  reason: string
  document_url: string | null
  created_at: string
  items: DataModelItem[]
}
