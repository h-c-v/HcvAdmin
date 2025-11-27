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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCustomers } from './customers-provider'

const customerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  status: z.enum(['active', 'inactive'] as const),
})

type CustomerFormValues = z.infer<typeof customerSchema>

export function CustomersActionDialog() {
  const { open, setOpen, currentCustomer } = useCustomers()
  const isEditing = open === 'update'

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (currentCustomer && isEditing) {
      form.reset({
        firstName: currentCustomer.firstName,
        lastName: currentCustomer.lastName,
        email: currentCustomer.email,
        password: currentCustomer.password,
        phone: currentCustomer.phone,
        status: currentCustomer.status,
      })
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        status: 'active',
      })
    }
  }, [currentCustomer, isEditing, form])

  const onSubmit = async (data: CustomerFormValues) => {
    console.log('Submitting customer:', data)
    // TODO: Implement GraphQL mutation
    // if (isEditing) {
    //   await updateCustomer({ id: currentCustomer!.id, ...data })
    // } else {
    //   await createCustomer(data)
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
                name='status'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar estado' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='active'>Activo</SelectItem>
                        <SelectItem value='inactive'>Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
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
