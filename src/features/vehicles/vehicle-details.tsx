import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IconArrowLeft, IconEdit, IconPlus } from '@tabler/icons-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { vehicleTypeLabels } from '@/types'
import { ServicesProvider, useServices } from '../services/components/services-provider'
import { ServicesTimeline } from '../services/components/services-timeline'
import { ServicesDialogs } from '../services/components/services-dialogs'
import { useQuery } from '@apollo/client/react'
import { GET_VEHICLE, type GetVehicleResponse } from '@/graphql/vehicles'
import { Loader2 } from 'lucide-react'

function ServicesNewButton() {
  const { setOpen, setCurrentService } = useServices()

  const handleNewService = () => {
    setCurrentService(null)
    setOpen('create')
  }

  return (
    <Button className='gap-2' onClick={handleNewService}>
      <IconPlus size={18} />
      Nuevo Servicio
    </Button>
  )
}

export default function VehicleDetailsPage() {
  const navigate = useNavigate()
  const { vehicleId } = useParams({ from: '/_authenticated/vehicles/$vehicleId' })

  // Fetch vehicle data using GraphQL
  const { data, loading, error } = useQuery<GetVehicleResponse>(GET_VEHICLE, {
    variables: { id: vehicleId },
  })

  const vehicle = data?.vehicle

  if (loading) {
    return (
      <>
        <Header fixed>
          <div className='ms-auto flex items-center space-x-4'>
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </Main>
      </>
    )
  }

  if (error || !vehicle) {
    return (
      <>
        <Header fixed>
          <div className='ms-auto flex items-center space-x-4'>
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-2'>Vehículo no encontrado</h2>
              <p className='text-muted-foreground mb-4'>
                {error ? `Error: ${error.message}` : 'El vehículo que buscas no existe.'}
              </p>
              <Button onClick={() => navigate({ to: '/all-vehicles' })}>
                Volver a Vehículos
              </Button>
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <ServicesProvider vehicleId={vehicleId}>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: '/all-vehicles' })}
          >
            <IconArrowLeft className='h-5 w-5' />
          </Button>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold tracking-tight'>
              {vehicle.vehicleBrand.name} {vehicle.vehicleModel.name} {vehicle.year}
            </h2>
            <p className='text-muted-foreground'>
              Patente: {vehicle.license}
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Información del Vehículo</CardTitle>
              <CardDescription>Detalles y especificaciones</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Marca</p>
                  <p className='text-base'>{vehicle.vehicleBrand.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Modelo</p>
                  <p className='text-base'>{vehicle.vehicleModel.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Año</p>
                  <p className='text-base'>{vehicle.year}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Patente</p>
                  <p className='text-base font-semibold'>{vehicle.license}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Kilometraje</p>
                  <p className='text-base'>{vehicle.mileage.toLocaleString()} km</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
              <CardDescription>Tipo y combustible</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Tipo de Vehículo</p>
                <Badge variant='outline' className='mt-1'>
                  {vehicleTypeLabels[vehicle.vehicleType as keyof typeof vehicleTypeLabels] || vehicle.vehicleType}
                </Badge>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Tipo de Combustible</p>
                <Badge variant='outline' className='mt-1'>
                  {vehicle.gasolineType}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Historial de Servicios</CardTitle>
                <CardDescription>
                  Registro completo de mantenimientos y reparaciones
                </CardDescription>
              </div>
              <ServicesNewButton />
            </div>
          </CardHeader>
          <CardContent>
            <ServicesTimeline vehicleId={vehicleId} />
          </CardContent>
        </Card>

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => navigate({ to: '/' })}>
            Volver
          </Button>
          <Button className='gap-2'>
            <IconEdit size={18} />
            Editar Vehículo
          </Button>
        </div>
      </Main>

      <ServicesDialogs />
    </ServicesProvider>
  )
}
