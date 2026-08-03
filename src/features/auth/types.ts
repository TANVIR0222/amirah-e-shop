export type User = {
  id?: number | string
  name?: string
  email?: string
  phone?: string | null
  company_name?: string | null
  role_id?: number | null
  biller_id?: number | null
  warehouse_id?: number | null
  is_active?: number
  is_deleted?: number
  created_at?: string
  updated_at?: string
}

export type AuthData = {
  access_token: string
  token_type: string
  user: User
}

export type UserLoginPayload = {
  email: string
  password: string
}

export type UserLoginResponse = {
  success: boolean
  message: string
  data: AuthData
}

export type UserRegisterPayload = {
  name: string
  email: string
  password: string
  phone: string
  is_active: number
  role_id: string
}

export type UserRegisterResponse = {
  success: boolean
  message: string
  data: {
    name: string
    email: string
    phone: string
    role_id: string
    is_active: number
    is_deleted: boolean
    updated_at: string
    created_at: string
    id: number
  }
}

export type UserVerifyPayload = {
  email: string
  otp: string
}

export type ResendOtpPayload = {
  email: string
}
