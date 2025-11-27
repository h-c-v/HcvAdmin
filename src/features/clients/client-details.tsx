import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconArrowLeft, IconEdit } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { mockClients, mockVehicles, mockCustomers } from '@/data/mock-data'
import { getClientFullName } from '@/types'
import VehiclesPage from '@/features/vehicles'

interface ClientDetailsPageProps {
  clientId: string
  customerId: string
}

export default function ClientDetailsPage({ clientId, customerId }: ClientDetailsPageProps) {
  const navigate = useNavigate()
  const client = mockClients.find(c => c.id === clientId)
  const customer = mockCustomers.find(c => c.id === customerId)
  const clientVehicles = mockVehicles.filter(v => v.clientId === clientId)

  if (!client) {
    return <div>Cliente no encontrado</div>
  }

  return (
    <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate({ to: `/customers/${customerId}/clients` })}
        >
          <IconArrowLeft className='h-5 w-5' />
        </Button>
        <div className='flex-1'>
          <h2 className='text-2xl font-bold tracking-tight'>{getClientFullName(client)}</h2>
          <p className='text-muted-foreground'>
            DNI: {client.dni} • {customer?.businessName}
          </p>
        </div>
        <Button className='gap-2'>
          <IconEdit size={18} />
          Editar Cliente
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Datos del cliente</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Nombre Completo</p>
              <p className='text-base'>{getClientFullName(client)}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>DNI/Cédula</p>
              <p className='text-base'>{client.dni}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Teléfono</p>
              <p className='text-base'>{client.phone}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p className='text-base'>{client.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dirección y Notas</CardTitle>
            <CardDescription>Información adicional</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Dirección</p>
              <p className='text-base'>{client.address}</p>
            </div>
            {client.notes && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Notas</p>
                <p className='text-base'>{client.notes}</p>
              </div>
            )}
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Vehículos Registrados</p>
              <Badge variant='secondary' className='mt-1'>
                {clientVehicles.length} {clientVehicles.length === 1 ? 'vehículo' : 'vehículos'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <VehiclesPage clientId={clientId} />
    </div>
  )
}
