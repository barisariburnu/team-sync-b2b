export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  access_token: string
  token_type: 'Bearer'
}

export type RegisterPayload = {
  email: string
  password: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type AuthUser = {
  id: number | string
  email?: string
  roles?: string[]
  permissions?: string[]
}

export type MeResponse = {
  user: AuthUser
}
