import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconEdit, IconTrash, IconEye, IconTool } from '@tabler/icons-react'
import { useServices } from './services-provider'
import { serviceStatusLabels, serviceStatusColors } from '@/types'
import { format } from 'date-fns'
import { mockServices } from '@/data/mock-data'

interface ServicesTimelineProps {
  vehicleId: string
}

export function ServicesTimeline({ vehicleId }: ServicesTimelineProps) {
  const { setOpen, setCurrentService } = useServices()

  // TODO: Fetch services from GraphQL
  const services = mockServices.filter(s => s.vehicleId === vehicleId)

  const handleViewDetail = (service: typeof mockServices[0]) => {
    setCurrentService(service)
    setOpen('view')
  }

  const handleEdit = (service: typeof mockServices[0]) => {
    setCurrentService(service)
    setOpen('update')
  }

  const handleDelete = (service: typeof mockServices[0]) => {
    setCurrentService(service)
    setOpen('delete')
  }

  if (services.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <IconTool className='h-12 w-12 text-muted-foreground mb-4' />
        <h3 className='text-lg font-semibold mb-2'>No hay servicios registrados</h3>
        <p className='text-sm text-muted-foreground'>
          Comienza registrando el primer servicio de este vehículo.
        </p>
      </div>
    )
  }

  return (
    <div className='relative space-y-4'>
      {/* Timeline line */}
      <div className='absolute left-[1.5rem] top-0 bottom-0 w-0.5 bg-border' />

      {services.map((service) => (
        <div key={service.id} className='relative flex gap-4'>
          {/* Timeline dot */}
          <div className='relative z-10'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary'>
              <IconTool className='h-5 w-5 text-primary-foreground' />
            </div>
          </div>

          {/* Service card */}
          <Card className='flex-1'>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='font-semibold text-lg'>{service.serviceTypes?.join(', ') || 'Servicio'}</h3>
                    <Badge variant={serviceStatusColors[service.status]}>
                      {serviceStatusLabels[service.status]}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {format(new Date(service.serviceDate), 'dd MMM yyyy')} • {service.mileage.toLocaleString()} km
                  </p>
                </div>
                <div className='flex gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleViewDetail(service)}
                    title='Ver detalles del servicio'
                  >
                    <IconEye className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEdit(service)}
                  >
                    <IconEdit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDelete(service)}
                  >
                    <IconTrash className='h-4 w-4 text-destructive' />
                  </Button>
                </div>
              </div>

              <p className='text-sm mb-3'>{service.description}</p>

              <div className='flex items-center justify-between text-sm'>
                <div>
                  <span className='text-muted-foreground'>Técnico: </span>
                  <span className='font-medium'>{service.technicianName}</span>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold'>${(service.totalCost ?? 0).toFixed(2)}</p>
                </div>
              </div>

              {service.parts.length > 0 && (
                <div className='mt-3 pt-3 border-t'>
                  <p className='text-xs text-muted-foreground mb-1'>
                    {service.parts.length} repuesto{service.parts.length !== 1 ? 's' : ''} utilizado{service.parts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {service.nextServiceDate && (
                <div className='mt-3 pt-3 border-t'>
                  <p className='text-xs text-muted-foreground'>
                    Próximo servicio: {format(new Date(service.nextServiceDate), 'dd MMM yyyy')}
                    {service.nextServiceMileage && ` o ${service.nextServiceMileage.toLocaleString()} km`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
