import { createFileRoute } from '@tanstack/react-router'
import NewServicePage from '@/features/services/new-service'

export const Route = createFileRoute('/_authenticated/vehicles/new-service')({
  component: NewServicePage,
})
