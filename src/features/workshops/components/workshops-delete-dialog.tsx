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
import { useWorkshops } from './workshops-provider'

export function WorkshopsDeleteDialog() {
  const { open, setOpen, currentWorkshop } = useWorkshops()

  const handleDelete = async () => {
    console.log('Deleting workshop:', currentWorkshop?.id)
    // TODO: Implement GraphQL mutation
    // await deleteWorkshop(currentWorkshop!.id)
    setOpen(null)
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            taller <strong>{currentWorkshop?.businessName}</strong> del sistema.
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
