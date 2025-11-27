import { createFileRoute } from '@tanstack/react-router'
import AllServicesPage from '@/features/all-services'
import { checkRoutePermission } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/all-services/')({
  beforeLoad: () => {
    checkRoutePermission('/all-services')
  },
  component: AllServicesPage,
})
