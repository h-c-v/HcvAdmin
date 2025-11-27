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

export function ServicesViewDialog() {
  const { open, setOpen, currentService } = useServices()

  if (!currentService) return null

  const handleClose = () => {
    setOpen(null)
  }

  return (
    <Dialog open={open === 'view'} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Detalles del Servicio</DialogTitle>
          <DialogDescription>
            {currentService.serviceType} - {format(new Date(currentService.serviceDate), 'dd/MM/yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Estado</p>
              <Badge variant={serviceStatusColors[currentService.status]}>
                {serviceStatusLabels[currentService.status]}
              </Badge>
            </div>
            <div className='text-right'>
              <p className='text-sm text-muted-foreground'>Costo Total</p>
              <p className='text-2xl font-bold'>${currentService.totalCost.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Tipo de Servicio</p>
              <p className='text-base'>{currentService.serviceType}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Fecha</p>
              <p className='text-base'>{format(new Date(currentService.serviceDate), 'dd/MM/yyyy')}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Kilometraje</p>
              <p className='text-base'>{currentService.mileage.toLocaleString()} km</p>
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

          {currentService.parts.length > 0 && (
            <>
              <Separator />
              <div>
                <p className='text-sm font-medium text-muted-foreground mb-3'>
                  Repuestos Utilizados
                </p>
                <div className='space-y-2'>
                  {currentService.parts.map((part) => (
                    <div key={part.id} className='flex justify-between items-center p-2 rounded-md bg-muted'>
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
                        <p className='font-semibold'>${part.totalPrice.toFixed(2)}</p>
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
                ${currentService.parts.reduce((sum, part) => sum + part.totalPrice, 0).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Mano de Obra</span>
              <span className='font-medium'>${currentService.laborCost.toFixed(2)}</span>
            </div>
            <Separator />
            <div className='flex justify-between text-lg'>
              <span className='font-semibold'>Total</span>
              <span className='font-bold'>${currentService.totalCost.toFixed(2)}</span>
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
                        {format(new Date(currentService.nextServiceDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  )}
                  {currentService.nextServiceMileage && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Kilometraje</p>
                      <p className='font-medium'>
                        {currentService.nextServiceMileage.toLocaleString()} km
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
