export interface ProfileResponse {
  id: number
  name: string
  email: string
  phone: string
  company_name: string | null
  role_id: number
  biller_id: number | null
  warehouse_id: number | null
  image: string | null
  is_active: number
  is_deleted: number
  created_at: string
  updated_at: string
}
export interface ProfileEditPayload {
  name: string
  phone: string
  image: string | null
}
export interface ProfileUpdateResponse {
  id: number
  name: string
  email: string
  phone: string
  image: string | null
  company_name: string | null
  role_id: number
  biller_id: number | null
  warehouse_id: number | null
  is_active: number
  is_deleted: number
  created_at: string
  updated_at: string
}
