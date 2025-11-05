import { type ZodObject, type TypeOf } from 'zod'
import { useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function useZodForm<TSchema extends ZodObject<any>>(
  schema: TSchema,
  options?: Omit<UseFormProps<TypeOf<TSchema>>, 'resolver'>
): UseFormReturn<TypeOf<TSchema>> {
  return useForm<TypeOf<TSchema>>({
    // Cast the resolver to any to bypass Zod v3/v4 type signature differences
    resolver: (zodResolver as any)(schema),
    ...options,
  })
}
