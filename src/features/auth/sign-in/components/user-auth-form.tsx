import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn, UserCog, Shield } from 'lucide-react'
import { toast } from 'sonner'
// import { useMutation } from '@apollo/client/react'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
// import { LOGIN, type LoginInput, type LoginResponse } from '@/graphql/mutations'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

// Mock users for testing
const MOCK_USERS = {
  admin: {
    id: '1',
    email: 'admin@hcv.com',
    role: ['admin'],
    institution: {
      id: '1',
      name: 'HCV Admin',
      logo: null,
    },
  },
  manager: {
    id: '2',
    email: 'manager@hcv.com',
    role: ['manager'],
    institution: {
      id: '2',
      name: 'HCV Taller Central',
      logo: null,
    },
  },
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Commented out real GraphQL login mutation
  // const [login, { loading }] = useMutation<LoginResponse, { input: LoginInput }>(LOGIN, {
  //   onCompleted: (data) => {
  //     const { token, user } = data.login

  //     // Store token in localStorage for Apollo Client
  //     localStorage.setItem('auth_token', token)

  //     // Set user and access token in auth store
  //     const authUser = {
  //       id: user.id,
  //       email: user.email,
  //       role: user.role ? [user.role] : ['user'],
  //       institution: {
  //         id: user.institution?.id || '',
  //         name: user.institution?.name || '',
  //         logoUrl: user.institution?.logoUrl,
  //       },
  //       exp: Date.now() + 24 * 10 * 60 * 60 * 1000, // 10 days from now
  //     }

  //     auth.setUser(authUser)
  //     auth.setAccessToken(token)

  //     toast.success(`Welcome back, ${user.email}!`)

  //     // Redirect to the stored location or default to dashboard
  //     const targetPath = redirectTo || '/_authenticated'
  //     navigate({ to: targetPath, replace: true })
  //   },
  //   onError: (error) => {
  //     console.error('Login error:', error)
  //     toast.error('Invalid credentials. Please try again.')
  //   }
  // })

  // Mock login function
  const mockLogin = (userType: 'admin' | 'manager') => {
    setLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const mockUser = MOCK_USERS[userType]
      const mockToken = `mock-token-${userType}-${Date.now()}`

      // Store token in localStorage
      localStorage.setItem('auth_token', mockToken)

      // Set user and access token in auth store
      const authUser = {
        ...mockUser,
        exp: Date.now() + 24 * 10 * 60 * 60 * 1000, // 10 days from now
      }

      auth.setUser(authUser)
      auth.setAccessToken(mockToken)

      toast.success(`Bienvenido, ${mockUser.email}! (Rol: ${userType})`)

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/_authenticated'
      navigate({ to: targetPath, replace: true })

      setLoading(false)
    }, 800)
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Commented out real login
    // try {
    //   await login({
    //     variables: {
    //       input: {
    //         email: data.email,
    //         password: data.password
    //       }
    //     }
    //   })
    // } catch (error) {
    //   // Error handled in onError callback
    // }

    toast.info('Login con formulario deshabilitado. Usa los botones de roles mock.')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {/* Mock Login Buttons */}
        <div className='grid gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4'>
          <div className='text-center'>
            <p className='text-sm font-semibold text-primary mb-1'>Modo de Prueba</p>
            <p className='text-xs text-muted-foreground'>Selecciona un rol para iniciar sesión</p>
          </div>

          <Button
            type='button'
            variant='outline'
            className='w-full justify-start gap-2 border-green-500/20 bg-green-500/5 hover:bg-green-500/10'
            onClick={() => mockLogin('admin')}
            disabled={loading}
          >
            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Shield className='h-4 w-4 text-green-600' />}
            <div className='flex flex-col items-start flex-1'>
              <span className='font-semibold'>Administrador</span>
              <span className='text-xs text-muted-foreground'>admin@hcv.com</span>
            </div>
          </Button>

          <Button
            type='button'
            variant='outline'
            className='w-full justify-start gap-2 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'
            onClick={() => mockLogin('manager')}
            disabled={loading}
          >
            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <UserCog className='h-4 w-4 text-blue-600' />}
            <div className='flex flex-col items-start flex-1'>
              <span className='font-semibold'>Gerente de Taller</span>
              <span className='text-xs text-muted-foreground'>manager@hcv.com</span>
            </div>
          </Button>
        </div>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              O inicia sesión con
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='nombre@ejemplo.com' {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} disabled />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled>
          <LogIn />
          Iniciar Sesión (Deshabilitado)
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              O continúa con
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled>
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled>
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
