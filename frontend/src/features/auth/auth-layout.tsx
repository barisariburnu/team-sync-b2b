import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-3 py-8 sm:w-[420px] sm:p-6 md:w-[480px] md:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2' />
          <div>
            <h1 className='text-xl font-medium'>Umay Console</h1>
            <p className='text-muted-foreground text-xs'>
              Secure access to your admin tools
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
