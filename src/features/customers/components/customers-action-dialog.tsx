import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCustomers } from './customers-provider'
import { CREATE_USER, type RegisterInput, type CreateUserResponse } from '@/graphql/mutations'
import { GET_CUSTOMERS } from '@/graphql/customers'

const customerSchema = z.object({
  names: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  documentId: z.string().min(1, 'El documento de identidad es requerido'),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

export function CustomersActionDialog() {
  const { open, setOpen, currentCustomer } = useCustomers()
  const isEditing = open === 'update'

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      names: '',
      lastName: '',
      email: '',
      password: '',
      documentId: '',
      phone: '',
      photoUrl: '',
    },
  })

  const [createUser, { loading }] = useMutation<CreateUserResponse, { input: RegisterInput }>(
    CREATE_USER,
    {
      refetchQueries: [
        {
          query: GET_CUSTOMERS,
          variables: {
            filter: { roles: ['MANAGER'] }
          }
        }
      ],
      onCompleted: (data) => {
        toast.success('Gerente de taller creado exitosamente')
        handleClose()
      },
      onError: (error) => {
        console.error('Error creating user:', error)
        toast.error(`Error al crear el gerente: ${error.message}`)
      },
    }
  )

  useEffect(() => {
    if (currentCustomer && isEditing) {
      form.reset({
        names: currentCustomer.names,
        lastName: currentCustomer.lastName,
        email: currentCustomer.email,
        password: '',
        documentId: '',
        phone: currentCustomer.phone || '',
        photoUrl: '',
      })
    } else {
      form.reset({
        names: '',
        lastName: '',
        email: '',
        password: '',
        documentId: '',
        phone: '',
        photoUrl: '',
      })
    }
  }, [currentCustomer, isEditing, form])

  const onSubmit = async (data: CustomerFormValues) => {
    if (isEditing) {
      // TODO: Implement update mutation
      toast.info('Edición de usuarios aún no implementada')
      return
    }

    // Crear nuevo usuario con rol MANAGER
    await createUser({
      variables: {
        input: {
          ...data,
          roles: ['MANAGER'],
        },
      },
    })
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  return (
    <Dialog open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información del usuario propietario.'
              : 'Completa la información para registrar un nuevo usuario propietario de talleres.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='names'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Juan' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Pérez' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='ejemplo@email.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='documentId'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Documento de Identidad</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: 12345678' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Mínimo 6 caracteres'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: +51 999 999 999' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='photoUrl'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>URL de Foto (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder='https://ejemplo.com/foto.jpg' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type='submit' disabled={loading}>
                {loading && <Loader2 className='animate-spin' />}
                {isEditing ? 'Actualizar' : 'Crear Gerente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
