import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ForgotPasswordPayload,
  MeResponse,
} from '@/types/auth'
import { post, get } from '@services/http'

export const authService = {
  async login(payload: LoginPayload) {
    return post<LoginResponse, LoginPayload>('/v1/auth/login', payload)
  },

  async register(payload: RegisterPayload) {
    return post<unknown, RegisterPayload>('/v1/auth/register', payload)
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    return post<unknown, ForgotPasswordPayload>(
      '/v1/auth/forgot-password',
      payload
    )
  },

  async me() {
    return get<MeResponse>('/v1/users/me')
  },
}
