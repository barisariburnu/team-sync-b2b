import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/schemas/auth'
import { authService } from '@/services/auth'
import { useZodForm } from '@shared/hooks/use-zod-form'
import { cn } from '@shared/lib/utils'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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

const formSchema = forgotPasswordSchema

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useZodForm(formSchema, {
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true)
    const promise: Promise<string> = (async () => {
      await authService.forgotPassword({ email: data.email })
      form.reset()
      navigate({ to: '/otp' })
      return `E-posta ${data.email} adresine gönderildi`
    })()
    toast.promise(promise, {
      loading: 'E-posta gönderiliyor...',
      success: (msg: string) => {
        setIsLoading(false)
        return msg
      },
      error: (err: unknown) => {
        setIsLoading(false)
        const message = (err as Error)?.message || 'Henüz uygulanmadı'
        return message
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
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
        <Button className='mt-2' disabled={isLoading}>
          Devam et
          {isLoading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
        </Button>
      </form>
    </Form>
  )
}
