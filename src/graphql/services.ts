import { gql } from '@apollo/client'

// Fragment para ServicePart
export const SERVICE_PART_FRAGMENT = gql`
  fragment ServicePartFields on ServicePart {
    id
    serviceId
    partName
    partCode
    quantity
    unitPrice
    totalPrice
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
    totalCost
    mileage
    technicianName
    photos
    nextServiceDate
    nextServiceMileage
    status
    notes
    createdAt
    updatedAt
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
