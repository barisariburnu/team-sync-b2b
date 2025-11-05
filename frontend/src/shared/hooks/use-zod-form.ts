import { z, type ZodObject, type ZodRawShape } from 'zod'
import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function useZodForm<TSchema extends ZodObject<ZodRawShape>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema) as Resolver<z.infer<TSchema>>,
    ...options,
  })
}
