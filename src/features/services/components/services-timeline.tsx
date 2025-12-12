import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconEdit, IconTrash, IconEye, IconTool } from '@tabler/icons-react'
import { useServices } from './services-provider'
import { serviceStatusLabels, serviceStatusColors } from '@/types'
import { format } from 'date-fns'
import { useQuery } from '@apollo/client/react'
import { GET_SERVICES_BY_VEHICLE, type GetServicesByVehicleResponse } from '@/graphql/services'
import { Loader2 } from 'lucide-react'

interface ServicesTimelineProps {
  vehicleId: string
}

export function ServicesTimeline({ vehicleId }: ServicesTimelineProps) {
  const { setOpen, setCurrentService } = useServices()

  // Fetch services from GraphQL
  const { data, loading, error } = useQuery<GetServicesByVehicleResponse>(GET_SERVICES_BY_VEHICLE, {
    variables: { vehicleId },
  })

  const services = data?.servicesByVehicle || []

  // Sort services by creation date (most recent first)
  const sortedServices = [...services].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()

    // Handle invalid dates
    if (isNaN(dateA) && isNaN(dateB)) return 0
    if (isNaN(dateA)) return 1
    if (isNaN(dateB)) return -1

    return dateB - dateA
  })

  const handleViewDetail = (service: typeof services[0]) => {
    setCurrentService(service)
    setOpen('view')
  }

  const handleEdit = (service: typeof services[0]) => {
    setCurrentService(service)
    setOpen('update')
  }

  const handleDelete = (service: typeof services[0]) => {
    setCurrentService(service)
    setOpen('delete')
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <p className='text-sm text-destructive mb-2'>Error al cargar los servicios</p>
        <p className='text-xs text-muted-foreground'>{error.message}</p>
      </div>
    )
  }

  if (sortedServices.length === 0) {
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

      {sortedServices.map((service) => (
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
                    <Badge variant={serviceStatusColors[service.status as keyof typeof serviceStatusColors]}>
                      {serviceStatusLabels[service.status as keyof typeof serviceStatusLabels]}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {service.serviceDate && !isNaN(new Date(service.serviceDate).getTime())
                      ? format(new Date(service.serviceDate), 'dd MMM yyyy')
                      : 'Fecha no disponible'} • {service.mileage.toLocaleString()} km
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
                  <p className='text-lg font-bold'>
                    ${(service.laborCost + (service.parts?.reduce((sum: number, part: { quantity: number; unitPrice: number }) => sum + (part.quantity * part.unitPrice), 0) || 0)).toFixed(2)}
                  </p>
                </div>
              </div>

              {service.parts && service.parts.length > 0 && (
                <div className='mt-3 pt-3 border-t'>
                  <p className='text-xs text-muted-foreground mb-1'>
                    {service.parts.length} repuesto{service.parts.length !== 1 ? 's' : ''} utilizado{service.parts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {service.nextServiceDate && !isNaN(new Date(service.nextServiceDate).getTime()) && (
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
