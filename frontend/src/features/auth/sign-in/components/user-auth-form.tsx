import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'
import { authService } from '@/services/auth'
import { useZodForm } from '@shared/hooks/use-zod-form'
import { cn } from '@shared/lib/utils'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = loginSchema.pick({ email: true, password: true })

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useZodForm(formSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: Pick<LoginFormValues, 'email' | 'password'>) {
    setIsLoading(true)
    const promise: Promise<string> = (async () => {
      const login = await authService.login({
        email: data.email,
        password: data.password,
      })
      auth.setAccessToken(login.access_token)
      const me = await authService.me()
      const apiUser = me.user
      const mappedUser = {
        accountNo: String(apiUser.id ?? ''),
        email: apiUser.email ?? data.email,
        role: apiUser.roles ?? [],
        exp: Date.now() + 24 * 60 * 60 * 1000,
      }
      auth.setUser(mappedUser)
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })
      return `Tekrar hoş geldin, ${mappedUser.email}!`
    })()
    toast.promise(promise, {
      loading: 'Giriş yapılıyor...',
      success: (msg: string) => {
        setIsLoading(false)
        return msg
      },
      error: (err: unknown) => {
        setIsLoading(false)
        const message = (err as Error)?.message || 'Giriş başarısız'
        return message
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input placeholder='ornek@eposta.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Şifremi unuttum?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Giriş yap
        </Button>

        {/* Social login removed */}
      </form>
    </Form>
  )
}
