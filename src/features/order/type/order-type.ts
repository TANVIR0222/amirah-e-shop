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
