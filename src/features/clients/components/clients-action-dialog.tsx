import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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

const clientSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  dni: z.string().min(1, 'El DNI/Cédula es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  address: z.string().min(1, 'La dirección es requerida'),
  notes: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

export function ClientsActionDialog() {
  const { open, setOpen, currentClient, customerId } = useClients()
  const isEditing = open === 'update'

  // Schema dinámico: contraseña requerida al crear, opcional al editar
  const getClientSchema = (isEditing: boolean) => {
    return z.object({
      firstName: z.string().min(1, 'El nombre es requerido'),
      lastName: z.string().min(1, 'El apellido es requerido'),
      dni: z.string().min(1, 'El DNI/Cédula es requerido'),
      phone: z.string().min(1, 'El teléfono es requerido'),
      email: z.string().email('Email inválido'),
      password: isEditing
        ? z.string().optional().or(z.literal(''))
        : z
            .string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            ),
      address: z.string().min(1, 'La dirección es requerida'),
      notes: z.string().optional(),
    })
  }

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(getClientSchema(isEditing)),
    defaultValues: {
      firstName: '',
      lastName: '',
      dni: '',
      phone: '',
      email: '',
      password: '',
      address: '',
      notes: '',
    },
  })

  useEffect(() => {
    // Actualizar el resolver cuando cambie el modo
    const newSchema = getClientSchema(isEditing)
    form.clearErrors()

    if (currentClient && isEditing) {
      form.reset({
        firstName: currentClient.firstName,
        lastName: currentClient.lastName,
        dni: currentClient.dni,
        phone: currentClient.phone,
        email: currentClient.email,
        password: '', // No mostrar la contraseña existente
        address: currentClient.address,
        notes: currentClient.notes || '',
      })
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        notes: '',
      })
    }
  }, [currentClient, isEditing, form])

  const onSubmit = async (data: ClientFormValues) => {
    console.log('Submitting client:', { ...data, customerId })
    // TODO: Implement GraphQL mutation
    // if (isEditing) {
    //   await updateClient({ id: currentClient!.id, ...data })
    // } else {
    //   await createClient({ customerId, ...data })
    // }
    handleClose()
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
                name='firstName'
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
                name='dni'
                render={({ field }) => (
                  <FormItem>
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
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: +51 999 999 999' {...field} />
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
                name='password'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>
                      Contraseña {isEditing && '(dejar vacío para mantener la actual)'}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Mínimo 8 caracteres'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ej: Av. Principal 123'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Notas (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Información adicional sobre el cliente...'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancelar
              </Button>
              <Button type='submit'>
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
