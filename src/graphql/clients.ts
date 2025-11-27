import { gql } from '@apollo/client'

// Fragment para Client (Cliente dueño de vehículos - con password)
// Nota: El password no se incluye en el fragment por seguridad
export const CLIENT_FRAGMENT = gql`
  fragment ClientFields on Client {
    id
    firstName
    lastName
    dni
    phone
    email
    address
    notes
    createdAt
    updatedAt
  }
`

// Query: Obtener todos los clientes
export const GET_CLIENTS = gql`
  ${CLIENT_FRAGMENT}
  query GetClients($limit: Int, $offset: Int, $search: String) {
    clients(limit: $limit, offset: $offset, search: $search) {
      items {
        ...ClientFields
      }
      total
      hasMore
    }
  }
`

// Query: Obtener un cliente por ID
export const GET_CLIENT = gql`
  ${CLIENT_FRAGMENT}
  query GetClient($id: ID!) {
    client(id: $id) {
      ...ClientFields
    }
  }
`

// Mutation: Crear cliente
export const CREATE_CLIENT = gql`
  ${CLIENT_FRAGMENT}
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      ...ClientFields
    }
  }
`

// Mutation: Actualizar cliente
export const UPDATE_CLIENT = gql`
  ${CLIENT_FRAGMENT}
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(input: $input) {
      ...ClientFields
    }
  }
`

// Mutation: Eliminar cliente
export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      success
      message
    }
  }
`
