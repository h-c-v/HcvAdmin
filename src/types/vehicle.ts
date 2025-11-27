export type VehicleType = 'car' | 'truck' | 'motorcycle' | 'suv' | 'van'
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'gas'

export interface Vehicle {
  id: string
  clientId: string // FK al cliente (requerido)
  brand: string
  model: string
  year: number
  license: string // Patente del vehículo
  color: string
  vehicleType: VehicleType
  currentMileage: number
  fuelType: FuelType
  createdAt: string
  updatedAt: string
}

export interface CreateVehicleInput {
  clientId: string // Requerido: el vehículo debe pertenecer a un cliente
  brand: string
  model: string
  year: number
  license: string // Patente del vehículo
  color: string
  vehicleType: VehicleType
  currentMileage: number
  fuelType: FuelType
}

export interface UpdateVehicleInput {
  id: string
  brand?: string
  model?: string
  year?: number
  license?: string
  color?: string
  vehicleType?: VehicleType
  currentMileage?: number
  fuelType?: FuelType
}

// Labels para tipos de vehículo
export const vehicleTypeLabels: Record<VehicleType, string> = {
  car: 'Automóvil',
  truck: 'Camioneta',
  motorcycle: 'Motocicleta',
  suv: 'SUV',
  van: 'Van/Furgoneta',
}

// Labels para tipos de combustible
export const fuelTypeLabels: Record<FuelType, string> = {
  gasoline: 'Gasolina',
  diesel: 'Diésel',
  electric: 'Eléctrico',
  hybrid: 'Híbrido',
  gas: 'Gas Natural',
}

// Helper para obtener el nombre completo del vehículo
export const getVehicleFullName = (vehicle: Vehicle): string => {
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
}

// Helper para obtener el nombre con patente
export const getVehicleWithLicense = (vehicle: Vehicle): string => {
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${vehicle.license}`
}
