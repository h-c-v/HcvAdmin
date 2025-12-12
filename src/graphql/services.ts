import { gql } from '@apollo/client'
import { type ServiceStatus } from '@/types/service'

// Fragment para ServicePart
export const SERVICE_PART_FRAGMENT = gql`
  fragment ServicePartFields on ServicePart {
    partName
    partCode
    quantity
    unitPrice
  }
`

// Fragment para Service
export const SERVICE_FRAGMENT = gql`
  ${SERVICE_PART_FRAGMENT}
  fragment ServiceFields on Service {
    id
    workshopId
    vehicleId
    serviceDate
    serviceTypes
    description
    parts {
      ...ServicePartFields
    }
    laborCost
    mileage
    technicianName
    nextServiceDate
    nextServiceMileage
    status
    notes
    createdAt
    updatedAt
    vehicle {
      id
      license
      year
      vehicleBrand {
        id
        name
      }
      vehicleModel {
        id
        name
      }
    }
  }
`

// Query: Obtener todos los servicios
export const GET_ALL_SERVICES = gql`
  ${SERVICE_FRAGMENT}
  query GetAllServices {
    services {
      ...ServiceFields
    }
  }
`

// Query: Obtener historial de servicios de un vehículo
export const GET_SERVICES = gql`
  ${SERVICE_FRAGMENT}
  query GetServices($vehicleId: ID!, $limit: Int, $offset: Int, $status: ServiceStatus) {
    services(vehicleId: $vehicleId, limit: $limit, offset: $offset, status: $status) {
      items {
        ...ServiceFields
      }
      total
      hasMore
    }
  }
`

// Query: Obtener servicios por vehículo (simple)
export const GET_SERVICES_BY_VEHICLE = gql`
  ${SERVICE_FRAGMENT}
  query GetServicesByVehicle($vehicleId: ID!) {
    servicesByVehicle(vehicleId: $vehicleId) {
      ...ServiceFields
    }
  }
`

// Query: Obtener un servicio por ID
export const GET_SERVICE = gql`
  ${SERVICE_FRAGMENT}
  query GetService($id: ID!) {
    service(id: $id) {
      ...ServiceFields
    }
  }
`

// Query: Obtener próximos servicios programados por taller
export const GET_UPCOMING_SERVICES = gql`
  ${SERVICE_FRAGMENT}
  query GetUpcomingServices($workshopId: ID!, $limit: Int) {
    upcomingServices(workshopId: $workshopId, limit: $limit) {
      ...ServiceFields
    }
  }
`

// Mutation: Crear servicio
export const CREATE_SERVICE = gql`
  ${SERVICE_FRAGMENT}
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      ...ServiceFields
    }
  }
`

// Mutation: Actualizar servicio
export const UPDATE_SERVICE = gql`
  ${SERVICE_FRAGMENT}
  mutation UpdateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
      ...ServiceFields
    }
  }
`

// Mutation: Eliminar servicio
export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      success
      message
    }
  }
`

// Query: Estadísticas de servicios por taller
export const GET_SERVICE_STATS = gql`
  query GetServiceStats($workshopId: ID!, $startDate: String, $endDate: String) {
    serviceStats(workshopId: $workshopId, startDate: $startDate, endDate: $endDate) {
      totalServices
      totalRevenue
      averageServiceCost
      mostCommonServiceType
      servicesCompleted
      servicesPending
      servicesInProgress
    }
  }
`

// Input types
export interface ServicePartInput {
  partName: string
  partCode?: string
  quantity: number
  unitPrice: number
}

export interface CreateServiceInput {
  workshopId: string
  vehicleId: string
  serviceDate: string
  serviceTypes: string[]
  description: string
  parts: ServicePartInput[]
  laborCost: number
  mileage: number
  technicianName: string
  nextServiceDate?: string
  nextServiceMileage?: number
  status: string
  notes?: string
}

export interface ServicePart {
  partName: string
  partCode?: string
  quantity: number
  unitPrice: number
}

export interface Service {
  id: string
  workshopId: string
  vehicleId: string
  serviceDate: string
  serviceTypes: string[]
  description: string
  parts: ServicePart[]
  laborCost: number
  totalCost?: number
  mileage: number
  technicianName: string
  nextServiceDate?: string
  nextServiceMileage?: number
  status: ServiceStatus
  notes?: string
  createdAt: string
  updatedAt: string
  vehicle?: {
    id: string
    license: string
    year: number
    vehicleBrand: {
      id: string
      name: string
    }
    vehicleModel: {
      id: string
      name: string
    }
  }
}

export interface CreateServiceResponse {
  createService: Service
}

export interface GetServicesResponse {
  services: {
    items: Service[]
    total: number
    hasMore: boolean
  }
}

export interface GetAllServicesResponse {
  services: Service[]
}

export interface GetServicesByVehicleResponse {
  servicesByVehicle: Service[]
}
