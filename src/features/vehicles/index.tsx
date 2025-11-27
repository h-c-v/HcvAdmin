import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VehiclesProvider } from './components/vehicles-provider'
import { VehiclesDialogs } from './components/vehicles-dialogs'
import { VehiclesTable } from './components/vehicles-table'

interface VehiclesPageProps {
  clientId: string
}

export default function VehiclesPage({ clientId }: VehiclesPageProps) {
  return (
    <VehiclesProvider clientId={clientId}>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Vehículos</CardTitle>
              <CardDescription>
                Gestiona los vehículos de este cliente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <VehiclesTable clientId={clientId} />
        </CardContent>
      </Card>
      <VehiclesDialogs />
    </VehiclesProvider>
  )
}
