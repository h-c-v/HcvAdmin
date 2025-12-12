import { gql } from '@apollo/client'

// Fragment para Vehicle
export const VEHICLE_FRAGMENT = gql`
  fragment VehicleFields on Vehicle {
    id
    vehicleBrandId
    vehicleModelId
    year
    license
    mileage
    vehicleType
    gasolineType
    createdAt
    updatedAt
    vehicleBrand {
      id
      name
    }
    vehicleModel {
      id
      name
      brandId
    }
  }
`

// Query: Obtener todas las marcas de vehículos
export const GET_VEHICLE_BRANDS = gql`
  query GetVehicleBrands {
    vehicleBrands {
      id
      name
      createdAt
      updatedAt
    }
  }
`

// Query: Obtener todos los modelos de vehículos
export const GET_VEHICLE_MODELS = gql`
  query GetVehicleModels {
    vehicleModels {
      id
      brandId
      name
      createdAt
      updatedAt
      brand {
        id
        name
      }
    }
  }
`

// Query: Obtener todos los vehículos
export const GET_VEHICLES = gql`
  ${VEHICLE_FRAGMENT}
  query GetVehicles {
    vehicles {
      ...VehicleFields
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

// Mutation: Crear vehículo
export const CREATE_VEHICLE = gql`
  ${VEHICLE_FRAGMENT}
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
      ...VehicleFields
    }
  }
`

// Types
export interface VehicleBrand {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface VehicleModel {
  id: string
  brandId: string
  name: string
  createdAt: string
  updatedAt: string
  brand: VehicleBrand
}

export interface CreateVehicleInput {
  vehicleBrandId: string
  vehicleModelId: string
  year: number
  license: string
  mileage: number
  vehicleType: string
  gasolineType: string
}

export interface Vehicle {
  id: string
  vehicleBrandId: string
  vehicleModelId: string
  year: number
  license: string
  mileage: number
  vehicleType: string
  gasolineType: string
  createdAt: string
  updatedAt: string
  vehicleBrand: VehicleBrand
  vehicleModel: VehicleModel
}

export interface CreateVehicleResponse {
  createVehicle: Vehicle
}

export interface GetVehicleBrandsResponse {
  vehicleBrands: VehicleBrand[]
}

export interface GetVehicleModelsResponse {
  vehicleModels: VehicleModel[]
}

export interface GetVehiclesResponse {
  vehicles: Vehicle[]
}

export interface GetVehicleResponse {
  vehicle: Vehicle
}

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
