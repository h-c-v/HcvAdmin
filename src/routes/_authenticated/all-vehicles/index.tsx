import { createFileRoute } from '@tanstack/react-router'
import AllVehiclesPage from '@/features/all-vehicles'
import { checkRoutePermission } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/all-vehicles/')({
  beforeLoad: () => {
    checkRoutePermission('/all-vehicles')
  },
  component: AllVehiclesPage,
})
