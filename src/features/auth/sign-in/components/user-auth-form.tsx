import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client/react'
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
import { LOGIN, type LoginInput, type LoginResponse } from '@/graphql/mutations'

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

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [login, { loading }] = useMutation<LoginResponse, { input: LoginInput }>(LOGIN, {
    onCompleted: (data) => {
      const { token, user } = data.login

      // Store token in localStorage for Apollo Client
      localStorage.setItem('auth_token', token)

      // Set user and access token in auth store
      const authUser = {
        id: user.id,
        email: user.email,
        names: user.names,
        lastName: user.lastName,
        role: user.roles?.length ? user.roles : ['CLIENT'],
        exp: Date.now() + 24 * 10 * 60 * 60 * 1000, // 10 days from now
      }

      auth.setUser(authUser)
      auth.setAccessToken(token)

      toast.success(`Bienvenido de vuelta, ${user.email}!`)

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/_authenticated'
      navigate({ to: targetPath, replace: true })
    },
    onError: (error) => {
      console.error('Login error:', error)
      toast.error('Credenciales inválidas. Por favor intenta de nuevo.')
    }
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await login({
        variables: {
          input: {
            email: data.email,
            password: data.password
          }
        }
      })
    } catch (error) {
      // Error handled in onError callback
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='nombre@ejemplo.com' {...field} />
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
                <PasswordInput placeholder='********' {...field} />
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
        <Button className='mt-2' disabled={loading}>
          {loading && <Loader2 className='animate-spin' />}
          <LogIn />
          Iniciar Sesión
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
