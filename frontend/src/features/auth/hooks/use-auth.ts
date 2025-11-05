import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { queryClient } from '@config/init'
import { authService } from '@services/auth'
import { queryKeys } from '@shared/query/query-keys'
import { invalidateAuth } from '@shared/query/utils'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.me(),
    staleTime: 60_000,
  })
}

export function useLoginMutation() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  return useMutation({
    mutationKey: queryKeys.auth.login,
    mutationFn: authService.login,
    onSuccess: (data, vars) => {
      auth.setAccessToken(data.access_token)
      invalidateAuth(queryClient)
      toast.success('Giriş başarılı')
      const redirect = (vars as { redirectTo?: string })?.redirectTo
      navigate({ to: redirect ?? '/_authenticated/' })
    },
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationKey: queryKeys.auth.register,
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Kayıt işlemi başarılı')
    },
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationKey: queryKeys.auth.forgotPassword,
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success('Şifre sıfırlama bağlantısı e-postanıza gönderildi')
    },
  })
}
