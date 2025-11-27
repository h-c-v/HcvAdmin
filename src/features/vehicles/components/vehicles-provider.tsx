import { createContext, useContext, useState, ReactNode } from 'react'
import { Vehicle } from '@/types'

export type VehiclesDialogType = 'create' | 'update' | 'delete' | 'view-services' | null

interface VehiclesContextValue {
  clientId: string
  open: VehiclesDialogType
  setOpen: (open: VehiclesDialogType) => void
  currentVehicle: Vehicle | null
  setCurrentVehicle: (vehicle: Vehicle | null) => void
}

const VehiclesContext = createContext<VehiclesContextValue | null>(null)

export function VehiclesProvider({
  children,
  clientId,
}: {
  children: ReactNode
  clientId: string
}) {
  const [open, setOpen] = useState<VehiclesDialogType>(null)
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null)

  return (
    <VehiclesContext.Provider
      value={{
        clientId,
        open,
        setOpen,
        currentVehicle,
        setCurrentVehicle,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  )
}

export function useVehicles() {
  const context = useContext(VehiclesContext)
  if (!context) {
    throw new Error('useVehicles must be used within VehiclesProvider')
  }
  return context
}
