import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IconArrowLeft, IconEdit, IconUsers } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

interface CustomerDetailsPageProps {
  customerId: string
}

// Mock data - Replace with GraphQL query
const mockCustomer = {
  id: '1',
  businessName: 'Taller Mecánico El Rápido',
  taxId: '20123456789',
  address: 'Av. Los Pinos 123, Lima',
  phone: '+51 999 888 777',
  email: 'contacto@elrapido.com',
  ownerName: 'Juan Pérez García',
  status: 'active' as const,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

export default function CustomerDetailsPage({ customerId }: CustomerDetailsPageProps) {
  const navigate = useNavigate()

  // TODO: Fetch customer data using GraphQL
  // const { data, loading } = useQuery(GET_CUSTOMER, { variables: { id: customerId } })

  const customer = mockCustomer

  return (
    <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate({ to: '/customers' })}
        >
          <IconArrowLeft className='h-5 w-5' />
        </Button>
        <div className='flex-1'>
          <h2 className='text-2xl font-bold tracking-tight'>{customer.businessName}</h2>
          <p className='text-muted-foreground'>
            RUC: {customer.taxId}
          </p>
        </div>
        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
          {customer.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
            <CardDescription>Detalles del taller o lubricentro</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Nombre del Negocio</p>
              <p className='text-base'>{customer.businessName}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>RUC/NIT</p>
              <p className='text-base'>{customer.taxId}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Dirección</p>
              <p className='text-base'>{customer.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>Datos del propietario y contacto</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Propietario</p>
              <p className='text-base'>{customer.ownerName}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p className='text-base'>{customer.email}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Teléfono</p>
              <p className='text-base'>{customer.phone}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Clientes del Taller</CardTitle>
              <CardDescription>Administra los clientes de este taller</CardDescription>
            </div>
            <Button
              onClick={() => navigate({ to: `/customers/${customerId}/clients` })}
              className='gap-2'
            >
              <IconUsers size={18} />
              Ver Todos los Clientes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground mb-4'>
            Gestiona la información de los clientes, sus vehículos y el historial de servicios realizados.
          </p>
          <div className='grid gap-2'>
            <Button
              variant='outline'
              onClick={() => navigate({ to: `/customers/${customerId}/clients` })}
              className='w-full justify-start gap-2'
            >
              <IconUsers size={18} />
              <div className='flex-1 text-left'>
                <p className='font-medium'>Gestionar Clientes</p>
                <p className='text-xs text-muted-foreground'>Ver, crear y editar clientes</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={() => navigate({ to: '/customers' })}>
          Volver
        </Button>
        <Button className='gap-2'>
          <IconEdit size={18} />
          Editar
        </Button>
      </div>
    </div>
  )
}
