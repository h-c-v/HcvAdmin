import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import ClientDetailsPage from '@/features/clients/client-details'

export const Route = createFileRoute('/_authenticated/customers/$customerId/clients/$clientId')({
  component: ClientDetailsPageWrapper,
})

function ClientDetailsPageWrapper() {
  const { customerId, clientId } = Route.useParams()

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <ClientDetailsPage clientId={clientId} customerId={customerId} />
      </Main>
    </>
  )
}
