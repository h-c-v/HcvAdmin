import { useSearch } from '@tanstack/react-router'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'
import logoHcv from './assets/logo_hcv.JPG'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn2() {
  const search = useSearch({ from: '/(auth)/sign-in-2' })

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo className='me-2' />
            <h1 className='text-xl font-medium'>HCV Admin</h1>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>Ingresar</h2>
            <p className='text-muted-foreground text-sm'>
              Ingresa tu email y contraseña <br />
              para acceder a tu cuenta
            </p>
          </div>
          <UserAuthForm redirectTo={search.redirect} />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Al iniciar sesión, aceptas nuestros{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Política de Privacidad
            </a>
            .
          </p>
        </div>
      </div>

      <div
        className={cn(
          'bg-muted relative h-full overflow-hidden max-lg:hidden flex items-center justify-center'
        )}
      >
        <img
          src={logoHcv}
          className='object-contain max-w-[80%] max-h-[80%]'
          alt='HCV Admin'
        />
      </div>
    </div>
  )
}
