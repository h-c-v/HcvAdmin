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
import { useClients } from './clients-provider'
import { getClientFullName } from '@/types'

export function ClientsDeleteDialog() {
  const { open, setOpen, currentClient } = useClients()

  const handleDelete = async () => {
    if (!currentClient) return

    console.log('Deleting client:', currentClient.id)
    // TODO: Implement GraphQL mutation
    // await deleteClient({ id: currentClient.id })

    setOpen(null)
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al
            cliente <strong>{currentClient ? getClientFullName(currentClient) : ''}</strong> y
            todos sus vehículos asociados.
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
