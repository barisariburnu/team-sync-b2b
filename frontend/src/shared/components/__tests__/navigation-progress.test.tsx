import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'

const routerState: { status: string } = { status: 'idle' }

vi.mock('@tanstack/react-router', () => ({
  useRouterState: () => routerState,
}))

type LoadingBarHandle = { continuousStart: () => void; complete: () => void }
const continuousStart = vi.fn()
const complete = vi.fn()

vi.mock('react-top-loading-bar', () => {
  const MockLoadingBar = React.forwardRef<LoadingBarHandle, Record<string, never>>((_props, ref) => {
    React.useImperativeHandle(ref, () => ({ continuousStart, complete }))
    return React.createElement('div', { 'data-testid': 'loading-bar' })
  })
  return { default: MockLoadingBar }
})

import { NavigationProgress } from '../navigation-progress'

describe('NavigationProgress', () => {
  beforeEach(() => {
    continuousStart.mockClear()
    complete.mockClear()
    routerState.status = 'idle'
  })

  it('completes on non-pending and starts on pending status changes', async () => {
    const { rerender } = render(<NavigationProgress />)

    await waitFor(() => {
      expect(complete).toHaveBeenCalledTimes(1)
    })

    routerState.status = 'pending'
    rerender(<NavigationProgress />)
    await waitFor(() => {
      expect(continuousStart).toHaveBeenCalledTimes(1)
    })

    routerState.status = 'idle'
    rerender(<NavigationProgress />)
    await waitFor(() => {
      expect(complete).toHaveBeenCalledTimes(2)
    })
  })
})