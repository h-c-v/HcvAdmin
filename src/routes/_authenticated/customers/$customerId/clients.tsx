import { createFileRoute } from '@tanstack/react-router'
import ClientsPage from '@/features/clients'

export const Route = createFileRoute('/_authenticated/customers/$customerId/clients')({
  component: ClientsPageWrapper,
})

function ClientsPageWrapper() {
  const { customerId } = Route.useParams()

  return <ClientsPage customerId={customerId} />
}
