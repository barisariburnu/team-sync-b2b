import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Skeleton } from '@/components/ui/skeleton'
import { listOrganizations, type Organization } from '@/services/organizations'
import { OrganizationsTable } from './components/organizations-table'

export function Organizations() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await listOrganizations()
      return res.data as Organization[]
    },
  })

  const orgs = useMemo(() => data ?? [], [data])

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Organizations</h2>
            <p className='text-muted-foreground'>
              View and manage your organizations.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className='grid gap-2'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        ) : isError ? (
          <div className='text-destructive'>Failed to load organizations.</div>
        ) : (
          <OrganizationsTable data={orgs} onChanged={refetch} />
        )}
      </Main>
    </>
  )
}