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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/password-input'
import { useClients } from './clients-provider'
import { CREATE_USER, type RegisterInput, type CreateUserResponse } from '@/graphql/mutations'
import { GET_CUSTOMERS } from '@/graphql/customers'

const clientSchema = z.object({
  names: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  documentId: z.string().min(1, 'El DNI/Cédula es requerido'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  photoUrl: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

export function ClientsActionDialog() {
  const { open, setOpen, currentClient, customerId } = useClients()
  const isEditing = open === 'update'

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      names: '',
      lastName: '',
      documentId: '',
      phone: '',
      email: '',
      password: '',
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
            filter: { roles: ['CLIENT'] }
          }
        }
      ],
      onCompleted: (data) => {
        toast.success('Cliente creado exitosamente')
        handleClose()
      },
      onError: (error) => {
        console.error('Error creating client:', error)
        toast.error(`Error al crear el cliente: ${error.message}`)
      },
    }
  )

  useEffect(() => {
    if (currentClient && isEditing) {
      form.reset({
        names: (currentClient as any).names || '',
        lastName: (currentClient as any).lastName || '',
        documentId: (currentClient as any).documentId || '',
        phone: (currentClient as any).phone || '',
        email: (currentClient as any).email || '',
        password: '',
        photoUrl: (currentClient as any).photoUrl || '',
      })
    } else {
      form.reset({
        names: '',
        lastName: '',
        documentId: '',
        phone: '',
        email: '',
        password: '',
        photoUrl: '',
      })
    }
  }, [currentClient, isEditing, form])

  const onSubmit = async (data: ClientFormValues) => {
    if (isEditing) {
      // TODO: Implement update mutation
      toast.info('Edición de clientes aún no implementada')
      return
    }

    // Crear nuevo usuario con rol CLIENT
    await createUser({
      variables: {
        input: {
          ...data,
          roles: ['CLIENT'],
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
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información del cliente.'
              : 'Completa la información para registrar un nuevo cliente.'}
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
                    <FormLabel>DNI/Cédula</FormLabel>
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
                      <PasswordInput
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
                {isEditing ? 'Actualizar' : 'Crear Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
