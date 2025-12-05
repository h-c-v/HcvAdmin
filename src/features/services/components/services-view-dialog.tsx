import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useServices } from './services-provider'
import { serviceStatusLabels, serviceStatusColors } from '@/types'
import { format } from 'date-fns'

// Función helper para calcular el costo total de un servicio
const calculateServiceTotalCost = (service: any): number => {
  const partsCost = service.parts.reduce((sum: number, part: any) => {
    return sum + (part.quantity * part.unitPrice)
  }, 0)
  return partsCost + (service.laborCost || 0)
}

export function ServicesViewDialog() {
  const { open, setOpen, currentService } = useServices()

  if (!currentService) return null

  const handleClose = () => {
    setOpen(null)
  }

  // Manejar fecha
  const formatServiceDate = (dateString: string) => {
    if (!dateString) return '-'
    const timestamp = !isNaN(Number(dateString)) ? Number(dateString) : dateString
    try {
      return format(new Date(timestamp), 'dd/MM/yyyy')
    } catch (error) {
      return dateString
    }
  }

  const totalCost = calculateServiceTotalCost(currentService)
  const mainServiceType = currentService.serviceTypes?.[0] || 'Servicio'

  return (
    <Dialog open={open === 'view'} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Detalles del Servicio</DialogTitle>
          <DialogDescription>
            {mainServiceType} - {formatServiceDate(currentService.serviceDate)}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Vehículo */}
          {currentService.vehicle && (
            <div className='p-4 bg-muted/50 rounded-md'>
              <p className='text-sm font-medium text-muted-foreground mb-1'>Vehículo</p>
              <p className='text-lg font-semibold'>
                {currentService.vehicle.vehicleBrand.name} {currentService.vehicle.vehicleModel.name} {currentService.vehicle.year}
              </p>
              <p className='text-sm text-muted-foreground font-mono'>
                Patente: {currentService.vehicle.license}
              </p>
            </div>
          )}

          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Estado</p>
              <Badge variant={serviceStatusColors[currentService.status]}>
                {serviceStatusLabels[currentService.status]}
              </Badge>
            </div>
            <div className='text-right'>
              <p className='text-sm text-muted-foreground'>Costo Total</p>
              <p className='text-2xl font-bold'>${totalCost.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Tipos de Servicio</p>
              <div className='flex flex-wrap gap-1 mt-1'>
                {currentService.serviceTypes?.map((type: string, index: number) => (
                  <Badge key={index} variant='outline'>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Fecha</p>
              <p className='text-base'>{formatServiceDate(currentService.serviceDate)}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Kilometraje</p>
              <p className='text-base'>{currentService.mileage?.toLocaleString()} km</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Técnico</p>
              <p className='text-base'>{currentService.technicianName}</p>
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground mb-2'>Descripción</p>
            <p className='text-base'>{currentService.description}</p>
          </div>

          {currentService.parts && currentService.parts.length > 0 && (
            <>
              <Separator />
              <div>
                <p className='text-sm font-medium text-muted-foreground mb-3'>
                  Repuestos Utilizados
                </p>
                <div className='space-y-2'>
                  {currentService.parts.map((part: any, index: number) => (
                    <div key={index} className='flex justify-between items-center p-2 rounded-md bg-muted'>
                      <div className='flex-1'>
                        <p className='font-medium'>{part.partName}</p>
                        {part.partCode && (
                          <p className='text-sm text-muted-foreground'>Código: {part.partCode}</p>
                        )}
                      </div>
                      <div className='text-right'>
                        <p className='text-sm text-muted-foreground'>
                          {part.quantity} x ${part.unitPrice.toFixed(2)}
                        </p>
                        <p className='font-semibold'>${(part.quantity * part.unitPrice).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Subtotal Repuestos</span>
              <span className='font-medium'>
                ${currentService.parts?.reduce((sum: number, part: any) => sum + (part.quantity * part.unitPrice), 0).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Mano de Obra</span>
              <span className='font-medium'>${currentService.laborCost?.toFixed(2)}</span>
            </div>
            <Separator />
            <div className='flex justify-between text-lg'>
              <span className='font-semibold'>Total</span>
              <span className='font-bold'>${totalCost.toFixed(2)}</span>
            </div>
          </div>

          {(currentService.nextServiceDate || currentService.nextServiceMileage) && (
            <>
              <Separator />
              <div className='bg-blue-50 dark:bg-blue-950 p-4 rounded-md'>
                <p className='text-sm font-medium mb-2'>Próximo Servicio Sugerido</p>
                <div className='flex gap-4'>
                  {currentService.nextServiceDate && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Fecha</p>
                      <p className='font-medium'>
                        {formatServiceDate(currentService.nextServiceDate)}
                      </p>
                    </div>
                  )}
                  {currentService.nextServiceMileage && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Kilometraje</p>
                      <p className='font-medium'>
                        {currentService.nextServiceMileage?.toLocaleString()} km
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {currentService.notes && (
            <>
              <Separator />
              <div>
                <p className='text-sm font-medium text-muted-foreground mb-2'>
                  Notas Adicionales
                </p>
                <p className='text-base'>{currentService.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
