import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@config/init'
import {
  listOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '@services/organizations'
import { queryKeys } from '@shared/query/query-keys'
import { invalidateOrganizations } from '@shared/query/utils'
import { toast } from 'sonner'

export function useOrganizationsQuery(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.organizations.list(filters),
    queryFn: () => listOrganizations(),
  })
}

export function useOrganizationQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(id),
    queryFn: () => getOrganization(id),
  })
}

export function useCreateOrganizationMutation() {
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      invalidateOrganizations(queryClient)
      toast.success('Organizasyon oluşturuldu')
    },
  })
}

export function useUpdateOrganizationMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof updateOrganization>[1]
    }) => updateOrganization(id, payload),
    onSuccess: () => {
      invalidateOrganizations(queryClient)
      toast.success('Organizasyon güncellendi')
    },
  })
}

export function useDeleteOrganizationMutation() {
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      invalidateOrganizations(queryClient)
      toast.success('Organizasyon silindi')
    },
  })
}
