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

export function VehiclesDeleteDialog() {
  const { open, setOpen, currentVehicle } = useVehicles()

  const handleDelete = async () => {
    if (!currentVehicle) return

    console.log('Deleting vehicle:', currentVehicle.id)
    // TODO: Implement GraphQL mutation
    // await deleteVehicle({ id: currentVehicle.id })

    setOpen(null)
  }

  const getVehicleFullName = () => {
    if (!currentVehicle) return ''
    return `${currentVehicle.vehicleBrand.name} ${currentVehicle.vehicleModel.name} ${currentVehicle.year}`
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            vehículo <strong>{getVehicleFullName()}</strong> y
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
