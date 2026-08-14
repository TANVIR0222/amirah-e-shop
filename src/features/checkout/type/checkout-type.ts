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
