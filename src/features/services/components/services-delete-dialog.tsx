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
import { useServices } from './services-provider'

export function ServicesDeleteDialog() {
  const { open, setOpen, currentService } = useServices()

  const handleDelete = async () => {
    if (!currentService) return

    console.log('Deleting service:', currentService.id)
    // TODO: Implement GraphQL mutation
    // await deleteService({ id: currentService.id })

    setOpen(null)
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            registro del servicio <strong>{currentService?.serviceType}</strong> realizado
            el {currentService?.serviceDate ? new Date(currentService.serviceDate).toLocaleDateString() : ''}.
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
