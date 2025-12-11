// @ts-nocheck
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useCustomers } from './customers-provider'

export function CustomersDeleteDialog() {
  const { open, setOpen, currentCustomer } = useCustomers()

  const handleDelete = async () => {
    if (!currentCustomer) return

    console.log('Deleting customer:', currentCustomer.id)
    // TODO: Implement GraphQL mutation
    // await deleteCustomer({ id: currentCustomer.id })

    setOpen(null)
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            taller <strong>{currentCustomer?.businessName}</strong> y todos sus
            datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
