// Customer: Usuario con rol MANAGER, propietario de uno o más talleres
export interface Customer {
  id: string
  names: string
  lastName: string
  email: string
  phone?: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerInput {
  names: string
  lastName: string
  email: string
  password: string
  phone?: string
  roles: string[] // Debe incluir 'MANAGER'
}

export interface UpdateCustomerInput {
  names?: string
  lastName?: string
  email?: string
  password?: string
  phone?: string
  roles?: string[]
}

// Input para filtrar usuarios MANAGER
export interface UsersFilterInput {
  roles?: string[]
  email?: string
  documentId?: string
}

// Helper para nombre completo
export const getCustomerFullName = (customer: Customer): string => {
  return `${customer.names} ${customer.lastName}`
}
