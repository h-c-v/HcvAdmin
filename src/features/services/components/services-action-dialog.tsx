// @ts-nocheck
import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IconPlus, IconTrash, IconX } from '@tabler/icons-react'
import { useServices } from './services-provider'
import { commonServiceTypes, serviceStatusLabels } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const servicePartSchema = z.object({
  partName: z.string().min(1, 'El nombre de la parte es requerido'),
  partCode: z.string().optional(),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser mayor a 0'),
  unitPrice: z.coerce.number().min(0, 'El precio debe ser positivo'),
})

const serviceSchema = z.object({
  workshopId: z.string().min(1, 'El taller es requerido'),
  vehicleId: z.string().min(1, 'El vehículo es requerido'),
  serviceDate: z.string().min(1, 'La fecha es requerida'),
  serviceTypes: z.array(z.string()).min(1, 'Selecciona al menos un tipo de servicio'),
  description: z.string().min(1, 'La descripción es requerida'),
  parts: z.array(servicePartSchema),
  laborCost: z.coerce.number().min(0, 'El costo de mano de obra debe ser positivo'),
  mileage: z.coerce.number().min(0, 'El kilometraje debe ser positivo'),
  technicianName: z.string().min(1, 'El nombre del técnico es requerido'),
  nextServiceDate: z.string().optional(),
  nextServiceMileage: z.coerce.number().optional(),
  status: z.enum(['completed', 'pending', 'in_progress', 'cancelled']),
  notes: z.string().optional(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

export function ServicesActionDialog() {
  const { open, setOpen, currentService, vehicleId } = useServices()
  const isEditing = open === 'update'

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      workshopId: '',
      vehicleId: vehicleId || '',
      serviceDate: new Date().toISOString().split('T')[0],
      serviceTypes: [],
      description: '',
      parts: [],
      laborCost: 0,
      mileage: 0,
      technicianName: '',
      nextServiceDate: '',
      nextServiceMileage: 0,
      status: 'completed',
      notes: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'parts',
  })

  const parts = form.watch('parts')
  const laborCost = form.watch('laborCost')

  const totalCost = parts.reduce((sum, part) => {
    return sum + (part.quantity * part.unitPrice)
  }, 0) + laborCost

  useEffect(() => {
    if (currentService && isEditing) {
      form.reset({
        workshopId: currentService.workshopId,
        vehicleId: currentService.vehicleId,
        serviceDate: currentService.serviceDate.split('T')[0],
        serviceTypes: currentService.serviceTypes || [],
        description: currentService.description,
        parts: currentService.parts.map(p => ({
          partName: p.partName,
          partCode: p.partCode,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
        })),
        laborCost: currentService.laborCost,
        mileage: currentService.mileage,
        technicianName: currentService.technicianName,
        nextServiceDate: currentService.nextServiceDate?.split('T')[0] || '',
        nextServiceMileage: currentService.nextServiceMileage || 0,
        status: currentService.status,
        notes: currentService.notes || '',
      })
    }
  }, [currentService, isEditing, form])

  const onSubmit = async (data: ServiceFormValues) => {
    console.log('Submitting service:', { ...data, vehicleId, totalCost })
    // TODO: Implement GraphQL mutation
    handleClose()
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  // TODO: Fetch real data from API
  const mockWorkshops = [
    { id: '1', name: 'Taller Mecánico Central' },
    { id: '2', name: 'Lubricentro Express' },
  ]

  const mockVehicles = [
    { id: '1', name: 'Toyota Corolla 2020 - ABC123' },
    { id: '2', name: 'Honda Civic 2019 - XYZ789' },
  ]

  const [customType, setCustomType] = useState('')

  const handleServiceTypeToggle = (type: string) => {
    const currentTypes = form.getValues('serviceTypes')
    if (currentTypes.includes(type)) {
      form.setValue('serviceTypes', currentTypes.filter(t => t !== type))
    } else {
      form.setValue('serviceTypes', [...currentTypes, type])
    }
  }

  const handleAddCustomType = () => {
    if (customType && !form.getValues('serviceTypes').includes(customType)) {
      form.setValue('serviceTypes', [...form.getValues('serviceTypes'), customType])
      setCustomType('')
    }
  }

  const handleRemoveType = (type: string) => {
    form.setValue('serviceTypes', form.getValues('serviceTypes').filter(t => t !== type))
  }

  const selectedTypes = form.watch('serviceTypes')

  return (
    <Dialog open={open === 'create' || open === 'update'} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información del servicio.'
              : 'Registra un nuevo servicio o reparación para este vehículo.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='workshopId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taller *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar taller' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockWorkshops.map((workshop) => (
                          <SelectItem key={workshop.id} value={workshop.id}>
                            {workshop.name}
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
                name='vehicleId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehículo *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar vehículo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
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
                name='serviceDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha del Servicio</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
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
                        {Object.entries(serviceStatusLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
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
                name='serviceTypes'
                render={() => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Tipos de Servicio *</FormLabel>
                    {selectedTypes.length > 0 && (
                      <div className='flex flex-wrap gap-2 mb-3 p-3 bg-muted/50 rounded-md border'>
                        {selectedTypes.map((type) => (
                          <Badge key={type} variant='default' className='gap-1 pr-1'>
                            {type}
                            <button
                              type='button'
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveType(type)
                              }}
                              className='ml-1 hover:text-destructive'
                            >
                              <IconX size={14} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className='flex gap-2 mb-3'>
                      <Input
                        placeholder='Agregar tipo personalizado...'
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddCustomType()
                          }
                        }}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={handleAddCustomType}
                        disabled={!customType}
                      >
                        <IconPlus size={18} />
                      </Button>
                    </div>

                    <div className='grid grid-cols-2 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto'>
                      {commonServiceTypes.map((type) => (
                        <div key={type} className='flex items-center space-x-2'>
                          <Checkbox
                            id={type}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => handleServiceTypeToggle(type)}
                          />
                          <Label
                            htmlFor={type}
                            className='text-sm font-normal cursor-pointer'
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe el trabajo realizado...'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='mileage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometraje</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='50000' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='technicianName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Técnico/Mecánico</FormLabel>
                    <FormControl>
                      <Input placeholder='Nombre del técnico' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <FormLabel>Repuestos Utilizados</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ partName: '', partCode: '', quantity: 1, unitPrice: 0 })}
                  className='gap-2'
                >
                  <IconPlus size={16} />
                  Agregar Repuesto
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className='grid grid-cols-12 gap-2 items-start'>
                  <div className='col-span-4'>
                    <FormField
                      control={form.control}
                      name={`parts.${index}.partName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Nombre del repuesto' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-2'>
                    <FormField
                      control={form.control}
                      name={`parts.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type='number' placeholder='Cant.' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-3'>
                    <FormField
                      control={form.control}
                      name={`parts.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type='number' step='0.01' placeholder='Precio' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-2 flex items-center justify-end'>
                    <span className='text-sm font-medium'>
                      ${((parts[index]?.quantity || 0) * (parts[index]?.unitPrice || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className='col-span-1'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => remove(index)}
                    >
                      <IconTrash size={16} className='text-destructive' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='laborCost'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo de Mano de Obra</FormLabel>
                    <FormControl>
                      <Input type='number' step='0.01' placeholder='0.00' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-end'>
                <div className='flex-1 p-3 bg-muted rounded-md'>
                  <p className='text-sm text-muted-foreground'>Costo Total</p>
                  <p className='text-2xl font-bold'>${totalCost.toFixed(2)}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name='nextServiceDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Servicio (Fecha)</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nextServiceMileage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Servicio (Km)</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='55000' {...field} />
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
                    <FormLabel>Notas Adicionales (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Observaciones, recomendaciones...'
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
                {isEditing ? 'Actualizar' : 'Registrar Servicio'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
