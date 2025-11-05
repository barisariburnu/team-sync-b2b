import { type JSX } from 'react'
import { startSpan, captureException } from '@shared/lib/sentry'
import { Button } from '@/components/ui/button'

export function SentryDemo(): JSX.Element {
  async function handleSpanDemo(): Promise<void> {
    await startSpan(
      {
        name: 'Demo: Quick Action',
        op: 'ui.click',
        attributes: { area: 'dashboard', component: 'SentryDemo' },
      },
      async () => {
        await new Promise((r) => setTimeout(r, 300))
        // Simulated lightweight work
      }
    )
  }

  async function handleErrorDemo(): Promise<void> {
    await startSpan(
      {
        name: 'Demo: Error Trigger',
        op: 'ui.click',
        attributes: { area: 'dashboard', component: 'SentryDemo' },
      },
      async () => {
        try {
          throw new Error('Demo error triggered')
        } catch (err) {
          captureException(err, { tags: { scope: 'demo' } })
        }
      }
    )
  }

  return (
    <div className='flex gap-2'>
      <Button variant='secondary' onClick={handleSpanDemo}>
        Sentry Span Demo
      </Button>
      <Button variant='destructive' onClick={handleErrorDemo}>
        Sentry Error Demo
      </Button>
    </div>
  )
}
