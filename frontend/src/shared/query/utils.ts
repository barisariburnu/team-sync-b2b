import { type QueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'

export function invalidateAuth(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
}

export function invalidateOrganizations(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.organizations.list(),
  })
}
