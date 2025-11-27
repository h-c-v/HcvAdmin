import { createFileRoute } from '@tanstack/react-router'
import CustomerDetailsPage from '@/features/customers/customer-details'

export const Route = createFileRoute('/_authenticated/customers/$customerId')({
  component: CustomerDetailsPageWrapper,
})

function CustomerDetailsPageWrapper() {
  const { customerId } = Route.useParams()

  return <CustomerDetailsPage customerId={customerId} />
}
