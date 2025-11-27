import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { IconEdit, IconTrash, IconExternalLink } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { mockVehicles, mockClients, mockServices } from '@/data/mock-data'
import { getVehicleFullName, vehicleTypeLabels, fuelTypeLabels, getClientFullName, serviceStatusLabels, serviceStatusColors } from '@/types'
import { format } from 'date-fns'

interface VehicleDetailSheetProps {
  vehicleId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (vehicleId: string) => void
  onDelete?: (vehicleId: string) => void
}

export function VehicleDetailSheet({
  vehicleId,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: VehicleDetailSheetProps) {
  const navigate = useNavigate()
  const vehicle = mockVehicles.find(v => v.id === vehicleId)
  const client = vehicle ? mockClients.find(c => c.id === vehicle.clientId) : null
  const services = vehicle ? mockServices.filter(s => s.vehicleId === vehicle.id) : []
  const latestService = services.sort((a, b) =>
    new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
  )[0]

  if (!vehicle) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-lg overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>{getVehicleFullName(vehicle)}</SheetTitle>
          <SheetDescription>
            Información detallada del vehículo
          </SheetDescription>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          {/* Información Principal */}
          <div>
            <h3 className='font-semibold mb-3'>Información del Vehículo</h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm text-muted-foreground'>Patente</span>
                <span className='font-mono font-semibold'>{vehicle.license}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-muted-foreground'>Color</span>
                <span>{vehicle.color}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-muted-foreground'>Tipo</span>
                <Badge variant='outline'>{vehicleTypeLabels[vehicle.vehicleType]}</Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-muted-foreground'>Combustible</span>
                <Badge variant='secondary'>{fuelTypeLabels[vehicle.fuelType]}</Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-muted-foreground'>Kilometraje</span>
                <span className='font-semibold'>{vehicle.currentMileage.toLocaleString()} km</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Propietario */}
          {client && (
            <>
              <div>
                <h3 className='font-semibold mb-3'>Propietario</h3>
                <div className='space-y-2'>
                  <p className='font-medium'>{getClientFullName(client)}</p>
                  <p className='text-sm text-muted-foreground'>{client.phone}</p>
                  <p className='text-sm text-muted-foreground'>{client.email}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Último Servicio */}
          {latestService && (
            <>
              <div>
                <h3 className='font-semibold mb-3'>Último Servicio</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>{latestService.serviceType}</p>
                      <p className='text-sm text-muted-foreground'>
                        {format(new Date(latestService.serviceDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <Badge variant={serviceStatusColors[latestService.status]}>
                      {serviceStatusLabels[latestService.status]}
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Costo</span>
                    <span className='font-semibold'>${latestService.totalCost.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Técnico</span>
                    <span className='text-sm'>{latestService.technicianName}</span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Estadísticas */}
          <div>
            <h3 className='font-semibold mb-3'>Estadísticas</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-lg border p-3'>
                <p className='text-sm text-muted-foreground'>Servicios</p>
                <p className='text-2xl font-bold'>{services.length}</p>
              </div>
              <div className='rounded-lg border p-3'>
                <p className='text-sm text-muted-foreground'>Total Gastado</p>
                <p className='text-2xl font-bold'>
                  ${services.reduce((sum, s) => sum + s.totalCost, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className='flex flex-col gap-2 pt-4'>
            <Button
              className='w-full gap-2'
              onClick={() => {
                navigate({ to: `/vehicles/${vehicle.id}` })
                onOpenChange(false)
              }}
            >
              <IconExternalLink size={18} />
              Ver Detalles Completos
            </Button>
            {onEdit && (
              <Button
                variant='outline'
                className='w-full gap-2'
                onClick={() => {
                  onEdit(vehicle.id)
                  onOpenChange(false)
                }}
              >
                <IconEdit size={18} />
                Editar Vehículo
              </Button>
            )}
            {onDelete && (
              <Button
                variant='destructive'
                className='w-full gap-2'
                onClick={() => {
                  onDelete(vehicle.id)
                  onOpenChange(false)
                }}
              >
                <IconTrash size={18} />
                Eliminar Vehículo
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
