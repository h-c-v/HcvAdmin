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
import { useVehicles } from './vehicles-provider'
import { getVehicleFullName } from '@/types'

export function VehiclesDeleteDialog() {
  const { open, setOpen, currentVehicle } = useVehicles()

  const handleDelete = async () => {
    if (!currentVehicle) return

    console.log('Deleting vehicle:', currentVehicle.id)
    // TODO: Implement GraphQL mutation
    // await deleteVehicle({ id: currentVehicle.id })

    setOpen(null)
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            vehículo <strong>{currentVehicle ? getVehicleFullName(currentVehicle) : ''}</strong> y
            todo su historial de servicios.
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
