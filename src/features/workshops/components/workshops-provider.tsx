import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Workshop } from '@/types'

type DialogType = 'create' | 'update' | 'delete' | null

interface WorkshopsContextType {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentWorkshop: Workshop | null
  setCurrentWorkshop: (workshop: Workshop | null) => void
}

const WorkshopsContext = createContext<WorkshopsContextType | undefined>(
  undefined
)

export function WorkshopsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null)

  return (
    <WorkshopsContext.Provider
      value={{
        open,
        setOpen,
        currentWorkshop,
        setCurrentWorkshop,
      }}
    >
      {children}
    </WorkshopsContext.Provider>
  )
}

export function useWorkshops() {
  const context = useContext(WorkshopsContext)
  if (context === undefined) {
    throw new Error('useWorkshops must be used within a WorkshopsProvider')
  }
  return context
}
