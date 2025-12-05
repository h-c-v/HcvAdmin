export interface Address {
  id: string
  street?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface User {
  id: string
  names: string
  lastName: string
  email: string
  roles: string[]
}

export interface Workshop {
  id: string
  name: string
  cuit: string
  status: boolean
  manager: string
  email: string
  phone: string
  addressId?: string
  userId?: string
  createdAt: string
  updatedAt: string
  address?: Address
  user?: User
}

export interface CreateWorkshopInput {
  name: string
  cuit?: string
  status?: boolean
  manager: string
  email: string
  phone: string
  addressId?: string
  userId?: string
}

export interface UpdateWorkshopInput {
  id: string
  name?: string
  cuit?: string
  status?: boolean
  manager?: string
  email?: string
  phone?: string
  addressId?: string
  userId?: string
}
