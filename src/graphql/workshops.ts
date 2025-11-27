import { gql } from '@apollo/client'

// Fragment para Workshop (Taller)
export const WORKSHOP_FRAGMENT = gql`
  fragment WorkshopFields on Workshop {
    id
    customerId
    businessName
    taxId
    address
    phone
    email
    ownerName
    status
    createdAt
    updatedAt
  }
`

// Query: Obtener todos los talleres de un customer
export const GET_WORKSHOPS = gql`
  ${WORKSHOP_FRAGMENT}
  query GetWorkshops($customerId: ID!, $limit: Int, $offset: Int, $search: String) {
    workshops(customerId: $customerId, limit: $limit, offset: $offset, search: $search) {
      items {
        ...WorkshopFields
      }
      total
      hasMore
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
