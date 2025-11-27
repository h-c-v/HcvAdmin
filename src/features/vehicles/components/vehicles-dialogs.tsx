import { useVehicles } from './vehicles-provider'
import { VehiclesActionDialog } from './vehicles-action-dialog'
import { VehiclesDeleteDialog } from './vehicles-delete-dialog'

export function VehiclesDialogs() {
  const { open } = useVehicles()

  return (
    <>
      {(open === 'create' || open === 'update') && <VehiclesActionDialog />}
      {open === 'delete' && <VehiclesDeleteDialog />}
    </>
  )
}
