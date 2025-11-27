import { useClients } from './clients-provider'
import { ClientsActionDialog } from './clients-action-dialog'
import { ClientsDeleteDialog } from './clients-delete-dialog'

export function ClientsDialogs() {
  const { open } = useClients()

  return (
    <>
      {(open === 'create' || open === 'update') && <ClientsActionDialog />}
      {open === 'delete' && <ClientsDeleteDialog />}
    </>
  )
}
