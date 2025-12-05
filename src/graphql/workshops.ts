import { gql } from '@apollo/client'

// Fragment para Workshop (Taller)
export const WORKSHOP_FRAGMENT = gql`
  fragment WorkshopFields on Workshop {
    id
    name
    cuit
    status
    manager
    email
    phone
    addressId
    userId
    createdAt
    updatedAt
    user {
      id
      names
      lastName
      email
      roles
    }
  }
`

// Query: Obtener todos los talleres
export const GET_WORKSHOPS = gql`
  ${WORKSHOP_FRAGMENT}
  query GetWorkshops {
    workshops {
      ...WorkshopFields
    }
  }
`

// Query: Obtener un taller por ID
export const GET_WORKSHOP = gql`
  ${WORKSHOP_FRAGMENT}
  query GetWorkshop($id: ID!) {
    workshop(id: $id) {
      ...WorkshopFields
    }
  }
`

// Mutation: Crear taller
export const CREATE_WORKSHOP = gql`
  ${WORKSHOP_FRAGMENT}
  mutation CreateWorkshop($input: CreateWorkshopInput!) {
    createWorkshop(input: $input) {
      ...WorkshopFields
    }
  }
`

// Input types
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

export interface Workshop {
  id: string
  name: string
  cuit?: string
  status: boolean
  manager: string
  email: string
  phone: string
  addressId?: string
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateWorkshopResponse {
  createWorkshop: Workshop
}

export interface GetWorkshopsResponse {
  workshops: Workshop[]
}

// Mutation: Actualizar taller
export const UPDATE_WORKSHOP = gql`
  ${WORKSHOP_FRAGMENT}
  mutation UpdateWorkshop($input: UpdateWorkshopInput!) {
    updateWorkshop(input: $input) {
      ...WorkshopFields
    }
  }
`

// Mutation: Eliminar taller
export const DELETE_WORKSHOP = gql`
  mutation DeleteWorkshop($id: ID!) {
    deleteWorkshop(id: $id) {
      success
      message
    }
  }
`
