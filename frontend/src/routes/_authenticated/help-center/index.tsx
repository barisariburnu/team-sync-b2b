import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@shared/components'

export const Route = createFileRoute('/_authenticated/help-center/')({
  component: ComingSoon,
})
