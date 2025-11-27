import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconPlus, IconCar, IconEdit, IconTrash } from '@tabler/icons-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useVehicles } from './vehicles-provider'
import { getVehicleFullName, vehicleTypeLabels, fuelTypeLabels } from '@/types'
import { mockVehicles } from '@/data/mock-data'
import { VehicleDetailSheet } from './vehicle-detail-sheet'

interface VehiclesTableProps {
  clientId: string
}

export function VehiclesTable({ clientId }: VehiclesTableProps) {
  const { setOpen, setCurrentVehicle } = useVehicles()
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // TODO: Fetch vehicles from GraphQL
  const vehicles = mockVehicles.filter(v => v.clientId === clientId)

  const handleCreate = () => {
    setCurrentVehicle(null)
    setOpen('create')
  }

  const handleEdit = (vehicle: typeof mockVehicles[0]) => {
    setCurrentVehicle(vehicle)
    setOpen('update')
  }

  const handleDelete = (vehicle: typeof mockVehicles[0]) => {
    setCurrentVehicle(vehicle)
    setOpen('delete')
  }

  const handleViewDetails = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
    setSheetOpen(true)
  }

  if (vehicles.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <IconCar className='h-12 w-12 text-muted-foreground mb-4' />
        <h3 className='text-lg font-semibold mb-2'>No hay vehículos registrados</h3>
        <p className='text-sm text-muted-foreground mb-4'>
          Comienza agregando el primer vehículo de este cliente.
        </p>
        <Button onClick={handleCreate} className='gap-2'>
          <IconPlus size={18} />
          Agregar Vehículo
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button onClick={handleCreate} className='gap-2'>
          <IconPlus size={18} />
          Agregar Vehículo
        </Button>
      </div>

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehículo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Combustible</TableHead>
              <TableHead>Kilometraje</TableHead>
              <TableHead className='w-[100px]'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <div>
                    <p className='font-medium'>{getVehicleFullName(vehicle)}</p>
                    <p className='text-sm text-muted-foreground'>{vehicle.color}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className='font-mono font-semibold'>{vehicle.license}</span>
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>
                    {vehicleTypeLabels[vehicle.vehicleType]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>
                    {fuelTypeLabels[vehicle.fuelType]}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.currentMileage.toLocaleString()} km</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleViewDetails(vehicle.id)}
                    >
                      <IconCar className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(vehicle)}
                    >
                      <IconEdit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(vehicle)}
                    >
                      <IconTrash className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <VehicleDetailSheet
        vehicleId={selectedVehicleId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onEdit={(id) => {
          const vehicle = vehicles.find(v => v.id === id)
          if (vehicle) {
            setCurrentVehicle(vehicle)
            setOpen('update')
          }
        }}
        onDelete={(id) => {
          const vehicle = vehicles.find(v => v.id === id)
          if (vehicle) {
            setCurrentVehicle(vehicle)
            setOpen('delete')
          }
        }}
      />
    </div>
  )
}
