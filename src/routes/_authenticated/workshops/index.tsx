import { createFileRoute } from '@tanstack/react-router'
import WorkshopsPage from '@/features/workshops'
import { checkRoutePermission } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/workshops/')({
  beforeLoad: () => {
    checkRoutePermission('/workshops')
  },
  component: WorkshopsPage,
})
