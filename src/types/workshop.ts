export type WorkshopStatus = 'active' | 'inactive'

export interface Workshop {
  id: string
  customerId: string // FK al Customer dueño del taller (requerido)
  businessName: string
  taxId: string // CUIT
  address: string
  phone: string
  email: string
  ownerName: string
  status: WorkshopStatus
  createdAt: string
  updatedAt: string
}

export interface CreateWorkshopInput {
  customerId: string // Requerido: el taller debe pertenecer a un Customer
  businessName: string
  taxId?: string // Opcional
  address: string
  phone: string
  email: string
  ownerName: string
  status?: WorkshopStatus
}

export interface UpdateWorkshopInput {
  id: string
  businessName?: string
  taxId?: string
  address?: string
  phone?: string
  email?: string
  ownerName?: string
  status?: WorkshopStatus
}
