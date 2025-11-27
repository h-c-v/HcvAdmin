import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ConfigDrawer } from '@/components/config-drawer'
import { WorkshopsDialogs } from './components/workshops-dialogs'
import { WorkshopsPrimaryButtons } from './components/workshops-primary-buttons'
import { WorkshopsProvider } from './components/workshops-provider'
import { WorkshopsTable } from './components/workshops-table'

export default function WorkshopsPage() {
  return (
    <WorkshopsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Talleres</h2>
            <p className='text-muted-foreground'>
              Gestiona los talleres y lubricentros asociados a cada propietario.
            </p>
          </div>
          <WorkshopsPrimaryButtons />
        </div>
        <WorkshopsTable />
      </Main>

      <WorkshopsDialogs />
    </WorkshopsProvider>
  )
}
