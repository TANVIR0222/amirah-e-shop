import { AxiosRequestConfig } from "axios"

export interface CreateReviewPayload {
  provider_id: string | number
  rating: number
  compliment: string
  quote_id: string
}

export interface BaseQueryArgs extends AxiosRequestConfig {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: any
  headers?: Record<string, string>
}
