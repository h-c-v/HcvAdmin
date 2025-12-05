import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQuery, useMutation } from '@apollo/client/react'
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
  FormDescription,
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
import { Switch } from '@/components/ui/switch'
import { useWorkshops } from './workshops-provider'
import { GET_CUSTOMERS } from '@/graphql/customers'
import {
  CREATE_WORKSHOP,
  GET_WORKSHOPS,
  type CreateWorkshopInput,
  type CreateWorkshopResponse,
} from '@/graphql/workshops'
import type { Customer } from '@/types'

const workshopSchema = z.object({
  userId: z.string().min(1, 'El propietario es requerido'),
  name: z.string().min(1, 'El nombre del taller es requerido'),
  cuit: z.string().optional(),
  manager: z.string().min(1, 'El nombre del encargado es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  status: z.boolean(),
  addressId: z.string().optional(),
})

type WorkshopFormValues = z.infer<typeof workshopSchema>

export function WorkshopsActionDialog() {
  const { open, setOpen, currentWorkshop } = useWorkshops()
  const isEditing = open === 'update'

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      userId: '',
      name: '',
      cuit: '',
      manager: '',
      email: '',
      phone: '',
      status: true,
      addressId: '',
    },
  })

  const [createWorkshop, { loading: creatingWorkshop }] = useMutation<
    CreateWorkshopResponse,
    { input: CreateWorkshopInput }
  >(CREATE_WORKSHOP, {
    refetchQueries: [{ query: GET_WORKSHOPS }],
    onCompleted: () => {
      toast.success('Taller creado exitosamente')
      handleClose()
    },
    onError: (error) => {
      console.error('Error creating workshop:', error)
      toast.error(`Error al crear el taller: ${error.message}`)
    },
  })

  useEffect(() => {
    if (currentWorkshop && isEditing) {
      form.reset({
        userId: currentWorkshop.userId || '',
        name: currentWorkshop.name,
        cuit: currentWorkshop.cuit || '',
        manager: currentWorkshop.manager,
        email: currentWorkshop.email,
        phone: currentWorkshop.phone,
        status: currentWorkshop.status,
        addressId: currentWorkshop.addressId || '',
      })
    } else {
      form.reset({
        userId: '',
        name: '',
        cuit: '',
        manager: '',
        email: '',
        phone: '',
        status: true,
        addressId: '',
      })
    }
  }, [currentWorkshop, isEditing, form])

  const onSubmit = async (data: WorkshopFormValues) => {
    if (isEditing) {
      // TODO: Implement update mutation
      toast.info('Edición de talleres aún no implementada')
      return
    }

    await createWorkshop({
      variables: {
        input: {
          name: data.name,
          cuit: data.cuit,
          status: data.status,
          manager: data.manager,
          email: data.email,
          phone: data.phone,
          addressId: data.addressId,
          userId: data.userId,
        },
      },
    })
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  // Obtener lista de usuarios con rol MANAGER (propietarios de talleres)
  const { data: customersData, loading: loadingCustomers } = useQuery<{
    users: Customer[]
  }>(GET_CUSTOMERS, {
    variables: {
      filter: {
        roles: ['MANAGER'],
      },
    },
  })

  const customers = customersData?.users || []

  return (
    <Dialog
      open={open === 'create' || open === 'update'}
      onOpenChange={handleClose}
    >
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Taller' : 'Nuevo Taller'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información del taller.'
              : 'Completa la información para registrar un nuevo taller.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Propietario (Gerente) *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing || loadingCustomers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingCustomers
                                ? 'Cargando...'
                                : 'Seleccionar propietario'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.names} {customer.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Nombre del Taller</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Taller Mecánico XYZ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='cuit'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CUIT (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: 20-12345678-9' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <div className='space-y-0.5'>
                      <FormLabel>Estado</FormLabel>
                      <FormDescription>
                        {field.value ? 'Activo' : 'Inactivo'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='manager'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Encargado / Responsable</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Carlos López' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email del Taller</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='taller@ejemplo.com'
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
                name='addressId'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>ID de Dirección (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder='ID de la dirección' {...field} />
                    </FormControl>
                    <FormDescription>
                      Asocia este taller con una dirección existente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={creatingWorkshop}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={creatingWorkshop}>
                {creatingWorkshop && <Loader2 className='animate-spin' />}
                {isEditing ? 'Actualizar' : 'Crear Taller'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
