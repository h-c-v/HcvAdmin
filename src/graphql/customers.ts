import { gql } from '@apollo/client'

// Fragment para Customer (Usuario propietario de talleres - con password)
export const CUSTOMER_FRAGMENT = gql`
  fragment CustomerFields on Customer {
    id
    firstName
    lastName
    email
    phone
    status
    createdAt
    updatedAt
  }
`

// Query: Obtener todos los customers
export const GET_CUSTOMERS = gql`
  ${CUSTOMER_FRAGMENT}
  query GetCustomers($limit: Int, $offset: Int, $search: String) {
    customers(limit: $limit, offset: $offset, search: $search) {
      items {
        ...CustomerFields
      }
      total
      hasMore
    }
  }
`

// Query: Obtener un customer por ID
export const GET_CUSTOMER = gql`
  ${CUSTOMER_FRAGMENT}
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      ...CustomerFields
    }
  }
`

// Mutation: Crear customer
export const CREATE_CUSTOMER = gql`
  ${CUSTOMER_FRAGMENT}
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      ...CustomerFields
    }
  }
`

// Mutation: Actualizar customer
export const UPDATE_CUSTOMER = gql`
  ${CUSTOMER_FRAGMENT}
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      ...CustomerFields
    }
  }
`

// Mutation: Eliminar customer
export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      success
      message
    }
  }
`
