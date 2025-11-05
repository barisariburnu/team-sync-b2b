import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Geçerli bir e-posta giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  remember: z.boolean().optional().default(false),
})

export const registerSchema = z
  .object({
    email: z.email('Geçerli bir e-posta giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Şifreler eşleşmiyor',
  })

export const forgotPasswordSchema = z.object({
  email: z.email('Geçerli bir e-posta giriniz'),
})

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'Kod 6 haneli olmalı')
    .max(6, 'Kod 6 haneli olmalı')
    .regex(/^[0-9]+$/, 'Kod sadece rakam olmalı'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type OtpFormValues = z.infer<typeof otpSchema>
