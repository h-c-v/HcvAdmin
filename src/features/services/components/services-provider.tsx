import { createContext, useContext, useState, ReactNode } from 'react'
import { Service } from '@/types'

export type ServicesDialogType = 'create' | 'update' | 'delete' | 'view' | null

interface ServicesContextValue {
  vehicleId: string
  open: ServicesDialogType
  setOpen: (open: ServicesDialogType) => void
  currentService: Service | null
  setCurrentService: (service: Service | null) => void
}

const ServicesContext = createContext<ServicesContextValue | null>(null)

export function ServicesProvider({
  children,
  vehicleId,
}: {
  children: ReactNode
  vehicleId: string
}) {
  const [open, setOpen] = useState<ServicesDialogType>(null)
  const [currentService, setCurrentService] = useState<Service | null>(null)

  return (
    <ServicesContext.Provider
      value={{
        vehicleId,
        open,
        setOpen,
        currentService,
        setCurrentService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServicesContext)
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider')
  }
  return context
}
