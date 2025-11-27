import { gql } from '@apollo/client'

// Fragment para Vehicle
export const VEHICLE_FRAGMENT = gql`
  fragment VehicleFields on Vehicle {
    id
    clientId
    brand
    model
    year
    license
    vin
    color
    vehicleType
    currentMileage
    fuelType
    createdAt
    updatedAt
  }
`

// Query: Obtener todos los vehículos de un cliente
export const GET_VEHICLES = gql`
  ${VEHICLE_FRAGMENT}
  query GetVehicles($clientId: ID!, $limit: Int, $offset: Int) {
    vehicles(clientId: $clientId, limit: $limit, offset: $offset) {
      items {
        ...VehicleFields
      }
      total
      hasMore
    }
  }
`

// Query: Obtener un vehículo por ID
export const GET_VEHICLE = gql`
  ${VEHICLE_FRAGMENT}
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      ...VehicleFields
    }
  }
`

// Query: Buscar vehículos por placa
export const SEARCH_VEHICLES = gql`
  ${VEHICLE_FRAGMENT}
  query SearchVehicles($customerId: ID!, $search: String!) {
    searchVehicles(customerId: $customerId, search: $search) {
      ...VehicleFields
    }
  }
`

// Mutation: Crear vehículo
export const CREATE_VEHICLE = gql`
  ${VEHICLE_FRAGMENT}
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
      ...VehicleFields
    }
  }
`

// Mutation: Actualizar vehículo
export const UPDATE_VEHICLE = gql`
  ${VEHICLE_FRAGMENT}
  mutation UpdateVehicle($input: UpdateVehicleInput!) {
    updateVehicle(input: $input) {
      ...VehicleFields
    }
  }
`

// Mutation: Eliminar vehículo
export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id) {
      success
      message
    }
  }
`
