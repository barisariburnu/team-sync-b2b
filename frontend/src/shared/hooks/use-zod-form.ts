import type { ZodObject, ZodRawShape, infer as ZodInfer } from 'zod'
import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function useZodForm<TSchema extends ZodObject<ZodRawShape>>(
  schema: TSchema,
  options?: Omit<UseFormProps<ZodInfer<TSchema>>, 'resolver'>
): UseFormReturn<ZodInfer<TSchema>> {
  return useForm<ZodInfer<TSchema>>({
    resolver: zodResolver(schema) as Resolver<ZodInfer<TSchema>>,
    ...options,
  })
}
