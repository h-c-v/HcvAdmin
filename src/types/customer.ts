export type CustomerStatus = 'active' | 'inactive'

// Customer: Usuario propietario de uno o más talleres
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string // Credential para autenticación del Customer
  phone: string
  status: CustomerStatus
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerInput {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  status?: CustomerStatus
}

export interface UpdateCustomerInput {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  phone?: string
  status?: CustomerStatus
}

// Helper para nombre completo
export const getCustomerFullName = (customer: Customer): string => {
  return `${customer.firstName} ${customer.lastName}`
}
