import { createFileRoute } from '@tanstack/react-router'
import AllClientsPage from '@/features/all-clients'
import { checkRoutePermission } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/all-clients/')({
  beforeLoad: () => {
    checkRoutePermission('/all-clients')
  },
  component: AllClientsPage,
})
