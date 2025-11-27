// Cliente: Dueño de vehículos (con password para autenticación)
export interface Client {
  id: string
  firstName: string
  lastName: string
  dni: string
  phone: string
  email: string
  password: string
  address: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateClientInput {
  firstName: string
  lastName: string
  dni: string
  phone: string
  email: string
  password: string
  address: string
  notes?: string
}

export interface UpdateClientInput {
  id: string
  firstName?: string
  lastName?: string
  dni?: string
  phone?: string
  email?: string
  password?: string
  address?: string
  notes?: string
}

// Helper para nombre completo
export const getClientFullName = (client: Client): string => {
  return `${client.firstName} ${client.lastName}`
}
