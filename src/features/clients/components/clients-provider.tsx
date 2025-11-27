import { createContext, useContext, useState, ReactNode } from 'react'
import { Client } from '@/types'

export type ClientsDialogType = 'create' | 'update' | 'delete' | 'view-vehicles' | null

interface ClientsContextValue {
  customerId: string
  open: ClientsDialogType
  setOpen: (open: ClientsDialogType) => void
  currentClient: Client | null
  setCurrentClient: (client: Client | null) => void
}

const ClientsContext = createContext<ClientsContextValue | null>(null)

export function ClientsProvider({
  children,
  customerId
}: {
  children: ReactNode
  customerId: string
}) {
  const [open, setOpen] = useState<ClientsDialogType>(null)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)

  return (
    <ClientsContext.Provider
      value={{
        customerId,
        open,
        setOpen,
        currentClient,
        setCurrentClient,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientsContext)
  if (!context) {
    throw new Error('useClients must be used within ClientsProvider')
  }
  return context
}
