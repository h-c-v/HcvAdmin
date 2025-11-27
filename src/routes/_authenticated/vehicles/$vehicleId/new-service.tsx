import { createFileRoute } from '@tanstack/react-router'
import NewServicePage from '@/features/services/new-service'

export const Route = createFileRoute('/_authenticated/vehicles/$vehicleId/new-service')({
  component: NewServicePage,
})
