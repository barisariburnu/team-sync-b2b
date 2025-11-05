// Centralized TanStack Query keys
// Usage: queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
    forgotPassword: ['auth', 'forgot-password'] as const,
  },
  organizations: {
    list: (filters?: Record<string, unknown>) =>
      ['organizations', 'list', filters ?? {}] as const,
    detail: (id: number | string) => ['organizations', 'detail', id] as const,
  },
  users: {
    list: (filters?: Record<string, unknown>) =>
      ['users', 'list', filters ?? {}] as const,
    detail: (id: number | string) => ['users', 'detail', id] as const,
  },
  tasks: {
    list: (filters?: Record<string, unknown>) =>
      ['tasks', 'list', filters ?? {}] as const,
    detail: (id: number | string) => ['tasks', 'detail', id] as const,
  },
} as const

export type QueryKey =
  | ReturnType<
      | typeof queryKeys.organizations.list
      | typeof queryKeys.organizations.detail
      | typeof queryKeys.users.list
      | typeof queryKeys.users.detail
      | typeof queryKeys.tasks.list
      | typeof queryKeys.tasks.detail
    >
  | typeof queryKeys.auth.me
