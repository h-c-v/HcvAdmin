import { Row } from '@tanstack/react-table'
import { IconDotsVertical, IconEdit, IconCar, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Client } from '@/types'
import { useClients } from './clients-provider'
import { useNavigate } from '@tanstack/react-router'

interface DataTableRowActionsProps {
  row: Row<Client>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const client = row.original
  const { setOpen, setCurrentClient, customerId } = useClients()
  const navigate = useNavigate()

  const handleEdit = () => {
    setCurrentClient(client)
    setOpen('update')
  }

  const handleDelete = () => {
    setCurrentClient(client)
    setOpen('delete')
  }

  const handleViewVehicles = () => {
    navigate({ to: `/customers/${customerId}/clients/${client.id}` })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <IconDotsVertical className='h-4 w-4' />
          <span className='sr-only'>Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleViewVehicles}>
          <IconCar className='me-2 h-4 w-4' />
          Ver vehículos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <IconEdit className='me-2 h-4 w-4' />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
          <IconTrash className='me-2 h-4 w-4' />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
