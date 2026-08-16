export interface ZoneLocation {
  id: string
  name: string
  areas: string[]
}

export interface CheckoutResponse {
  success: boolean
  message: string
  data: ZoneLocation[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: PaginatedResponse<T>
}

export interface PaginatedResponse<T> {
  current_page: number
  last_page: number
  per_page: number
  total: number
  orders: T[]
}

// ── Domain Models ────────────────────────────────────

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
}
