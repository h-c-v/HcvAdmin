import { gql } from '@apollo/client'


export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        names
        lastName
        roles
      }
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($input: RegisterInput!) {
    createUser(input: $input) {
      id
      email
      names
      lastName
      documentId
      phone
      photoUrl
      roles
      createdAt
      updatedAt
    }
  }
`

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  names: string
  lastName: string
  documentId: string
  phone?: string
  photoUrl?: string
  roles?: string[]
}

export interface AuthUser {
  id: string
  email: string
  names: string
  lastName: string
  roles?: string[]
}

export interface User {
  id: string
  email: string
  names: string
  lastName: string
  documentId: string
  phone?: string
  photoUrl?: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginResponse {
  login: AuthResponse
}

export interface CreateUserResponse {
  createUser: User
}