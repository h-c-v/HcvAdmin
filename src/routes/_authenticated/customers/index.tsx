import { createFileRoute } from '@tanstack/react-router'
import CustomersPage from '@/features/customers'
import { checkRoutePermission } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/customers/')({
  beforeLoad: () => {
    checkRoutePermission('/customers')
  },
  component: CustomersPage,
})
