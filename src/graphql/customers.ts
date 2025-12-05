import { gql } from '@apollo/client'

// Fragment para User (Usuarios con rol MANAGER que son propietarios de talleres)
export const USER_MANAGER_FRAGMENT = gql`
  fragment UserManagerFields on User {
    id
    names
    lastName
    email
    phone
    roles
    createdAt
    updatedAt
  }
`

// Query: Obtener usuarios con rol MANAGER (customers)
export const GET_CUSTOMERS = gql`
  ${USER_MANAGER_FRAGMENT}
  query GetCustomers($filter: UsersFilterInput) {
    users(filter: $filter) {
      ...UserManagerFields
    }
  }
`

// Query: Obtener un usuario manager por ID
export const GET_CUSTOMER = gql`
  ${USER_MANAGER_FRAGMENT}
  query GetCustomer($id: ID!) {
    user(id: $id) {
      ...UserManagerFields
    }
  }
`

// Mutation: Crear usuario manager (customer)
export const CREATE_CUSTOMER = gql`
  ${USER_MANAGER_FRAGMENT}
  mutation CreateCustomer($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserManagerFields
    }
  }
`

// Mutation: Actualizar usuario manager (customer)
export const UPDATE_CUSTOMER = gql`
  ${USER_MANAGER_FRAGMENT}
  mutation UpdateCustomer($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserManagerFields
    }
  }
`

// Mutation: Eliminar usuario manager (customer)
export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`
