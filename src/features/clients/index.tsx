import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { ClientsDialogs } from './components/clients-dialogs'
import { ClientsPrimaryButtons } from './components/clients-primary-buttons'
import { ClientsProvider } from './components/clients-provider'
import { ClientsTable } from './components/clients-table'

interface ClientsPageProps {
  customerId: string
}

export default function ClientsPage({ customerId }: ClientsPageProps) {
  const navigate = useNavigate()

  return (
    <ClientsProvider customerId={customerId}>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: `/customers/${customerId}` })}
          >
            <IconArrowLeft className='h-5 w-5' />
          </Button>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold tracking-tight'>Clientes</h2>
            <p className='text-muted-foreground'>
              Gestiona los clientes de este taller.
            </p>
          </div>
          <ClientsPrimaryButtons />
        </div>
        <ClientsTable customerId={customerId} />
      </Main>

      <ClientsDialogs />
    </ClientsProvider>
  )
}
