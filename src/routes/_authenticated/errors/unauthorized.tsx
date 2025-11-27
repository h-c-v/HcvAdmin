import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/errors/unauthorized')({
  component: UnauthorizedPage,
})

function UnauthorizedPage() {
  return (
    <div className='flex min-h-[80vh] items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
            <ShieldAlert className='h-8 w-8 text-destructive' />
          </div>
          <CardTitle className='text-2xl'>Acceso No Autorizado</CardTitle>
          <CardDescription className='text-base'>
            No tienes permisos para acceder a esta sección
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground text-center text-sm'>
            Esta página está restringida según tu rol de usuario. Si crees que
            deberías tener acceso, contacta con el administrador del sistema.
          </p>
          <div className='flex flex-col gap-2'>
            <Button asChild className='w-full'>
              <Link to='/'>Volver al Dashboard</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link to='/settings'>Ir a Configuración</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
