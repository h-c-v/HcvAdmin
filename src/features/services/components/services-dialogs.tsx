import { useServices } from './services-provider'
import { ServicesActionDialog } from './services-action-dialog'
import { ServicesDeleteDialog } from './services-delete-dialog'
import { ServicesViewDialog } from './services-view-dialog'

export function ServicesDialogs() {
  const { open } = useServices()

  return (
    <>
      {(open === 'create' || open === 'update') && <ServicesActionDialog />}
      {open === 'delete' && <ServicesDeleteDialog />}
      {open === 'view' && <ServicesViewDialog />}
    </>
  )
}
