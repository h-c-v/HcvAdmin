import { createContext, useContext, useState, ReactNode } from 'react'
import { Customer } from '@/types'

export type CustomersDialogType = 'create' | 'update' | 'delete' | null

interface CustomersContextValue {
  open: CustomersDialogType
  setOpen: (open: CustomersDialogType) => void
  currentCustomer: Customer | null
  setCurrentCustomer: (customer: Customer | null) => void
}

const CustomersContext = createContext<CustomersContextValue | null>(null)

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<CustomersDialogType>(null)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)

  return (
    <CustomersContext.Provider
      value={{
        open,
        setOpen,
        currentCustomer,
        setCurrentCustomer,
      }}
    >
      {children}
    </CustomersContext.Provider>
  )
}

export function useCustomers() {
  const context = useContext(CustomersContext)
  if (!context) {
    throw new Error('useCustomers must be used within CustomersProvider')
  }
  return context
}
