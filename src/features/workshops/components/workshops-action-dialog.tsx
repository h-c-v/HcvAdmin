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
import { useWorkshops } from './workshops-provider'

const workshopSchema = z.object({
  customerId: z.string().min(1, 'El propietario es requerido'),
  businessName: z.string().min(1, 'El nombre del negocio es requerido'),
  taxId: z.string().optional(),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  ownerName: z.string().min(1, 'El nombre del encargado es requerido'),
  status: z.enum(['active', 'inactive'] as const),
})

type WorkshopFormValues = z.infer<typeof workshopSchema>

export function WorkshopsActionDialog() {
  const { open, setOpen, currentWorkshop } = useWorkshops()
  const isEditing = open === 'update'

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      customerId: '',
      businessName: '',
      taxId: '',
      address: '',
      phone: '',
      email: '',
      ownerName: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (currentWorkshop && isEditing) {
      form.reset({
        customerId: currentWorkshop.customerId,
        businessName: currentWorkshop.businessName,
        taxId: currentWorkshop.taxId,
        address: currentWorkshop.address,
        phone: currentWorkshop.phone,
        email: currentWorkshop.email,
        ownerName: currentWorkshop.ownerName,
        status: currentWorkshop.status,
      })
    } else {
      form.reset({
        customerId: '',
        businessName: '',
        taxId: '',
        address: '',
        phone: '',
        email: '',
        ownerName: '',
        status: 'active',
      })
    }
  }, [currentWorkshop, isEditing, form])

  const onSubmit = async (data: WorkshopFormValues) => {
    console.log('Submitting workshop:', data)
    // TODO: Implement GraphQL mutation
    // if (isEditing) {
    //   await updateWorkshop({ id: currentWorkshop!.id, ...data })
    // } else {
    //   await createWorkshop(data)
    // }
    handleClose()
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  // TODO: Fetch customers list for select
  const mockCustomers = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
  ]

  return (
    <Dialog open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
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
                name='customerId'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Usuario Propietario *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar propietario' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
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
                name='businessName'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Nombre del Negocio</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Taller Mecánico XYZ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='taxId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CUIT</FormLabel>
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
                  <FormItem>
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

              <FormField
                control={form.control}
                name='ownerName'
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
                    <FormLabel>Email del Negocio</FormLabel>
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
                name='address'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Dirección Completa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ej: Av. Principal 123, Lima'
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
