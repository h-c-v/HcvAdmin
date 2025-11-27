import { createFileRoute } from '@tanstack/react-router'
import VehicleDetailsPage from '@/features/vehicles/vehicle-details'

export const Route = createFileRoute('/_authenticated/vehicles/$vehicleId')({
  component: VehicleDetailsPage,
})
