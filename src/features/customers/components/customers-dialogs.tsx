import { useCustomers } from './customers-provider'
import { CustomersActionDialog } from './customers-action-dialog'
import { CustomersDeleteDialog } from './customers-delete-dialog'

export function CustomersDialogs() {
  const { open } = useCustomers()

  return (
    <>
      {(open === 'create' || open === 'update') && <CustomersActionDialog />}
      {open === 'delete' && <CustomersDeleteDialog />}
    </>
  )
}
