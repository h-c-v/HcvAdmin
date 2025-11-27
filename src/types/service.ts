export type ServiceStatus = 'completed' | 'pending' | 'in_progress' | 'cancelled'

export interface ServicePart {
  id: string
  serviceId: string
  partName: string
  partCode?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Service {
  id: string
  workshopId: string // FK al taller donde se realizó el servicio (requerido)
  vehicleId: string // FK al vehículo (requerido)
  serviceDate: string
  serviceTypes: string[] // Array de tipos de servicio (tags múltiples)
  description: string
  parts: ServicePart[]
  laborCost: number
  totalCost: number
  mileage: number
  technicianName: string
  photos?: string[]
  nextServiceDate?: string
  nextServiceMileage?: number
  status: ServiceStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateServicePartInput {
  partName: string
  partCode?: string
  quantity: number
  unitPrice: number
}

export interface CreateServiceInput {
  workshopId: string // Requerido: el servicio debe pertenecer a un taller
  vehicleId: string // Requerido: el servicio debe estar asociado a un vehículo
  serviceDate: string
  serviceTypes: string[] // Array de tipos de servicio
  description: string
  parts: CreateServicePartInput[]
  laborCost: number
  mileage: number
  technicianName: string
  photos?: string[]
  nextServiceDate?: string
  nextServiceMileage?: number
  status?: ServiceStatus
  notes?: string
}

export interface UpdateServiceInput {
  id: string
  serviceDate?: string
  serviceTypes?: string[]
  description?: string
  parts?: CreateServicePartInput[]
  laborCost?: number
  mileage?: number
  technicianName?: string
  photos?: string[]
  nextServiceDate?: string
  nextServiceMileage?: number
  status?: ServiceStatus
  notes?: string
}

// Labels para estados de servicio
export const serviceStatusLabels: Record<ServiceStatus, string> = {
  completed: 'Completado',
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  cancelled: 'Cancelado',
}

// Colores para badges de estado
export const serviceStatusColors: Record<
  ServiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  completed: 'default',
  pending: 'secondary',
  in_progress: 'outline',
  cancelled: 'destructive',
}

// Tipos de servicio comunes
export const commonServiceTypes = [
  'Cambio de Aceite',
  'Cambio de Filtros',
  'Alineación y Balanceo',
  'Cambio de Frenos',
  'Mantenimiento Preventivo',
  'Reparación de Motor',
  'Reparación de Transmisión',
  'Cambio de Neumáticos',
  'Revisión General',
  'Reparación Eléctrica',
  'Reparación de Suspensión',
  'Cambio de Batería',
  'Diagnóstico Computarizado',
  'Otro',
] as const
