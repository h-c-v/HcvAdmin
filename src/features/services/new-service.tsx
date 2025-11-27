import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IconPlus, IconTrash, IconArrowLeft, IconX } from '@tabler/icons-react'
import { commonServiceTypes, serviceStatusLabels, getVehicleFullName, getClientFullName } from '@/types'
import { mockVehicles, mockClients } from '@/data/mock-data'
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
  vehicleId: z.string().min(1, 'Debes seleccionar un vehículo'),
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

export default function NewServicePage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/_authenticated/vehicles/new-service' }) as { vehicleId?: string }
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(searchParams?.vehicleId || '')

  // TODO: Fetch vehicle data using GraphQL
  const vehicle = mockVehicles.find(v => v.id === selectedVehicleId)

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      workshopId: '',
      vehicleId: searchParams?.vehicleId || '',
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
    if (vehicle) {
      form.setValue('mileage', vehicle.currentMileage)
    }
  }, [vehicle, form])

  const onSubmit = async (data: ServiceFormValues) => {
    console.log('Creating service:', {
      ...data,
      totalCost
    })
    // TODO: Implement GraphQL mutation with workshopId and vehicleId

    // Navigate back to vehicle details or services list after successful creation
    if (data.vehicleId) {
      navigate({ to: `/vehicles/${data.vehicleId}` })
    } else {
      navigate({ to: '/all-services' })
    }
  }

  // TODO: Fetch real data from API
  const mockWorkshops = [
    { id: '1', name: 'Taller Mecánico Central' },
    { id: '2', name: 'Lubricentro Express' },
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

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
    form.setValue('vehicleId', vehicleId)
    const selectedVehicle = mockVehicles.find(v => v.id === vehicleId)
    if (selectedVehicle) {
      form.setValue('mileage', selectedVehicle.currentMileage)
    }
  }

  if (selectedVehicleId && !vehicle) {
    return (
      <>
        <Header fixed>
          <div className='ms-auto flex items-center space-x-4'>
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-2'>Vehículo no encontrado</h2>
              <p className='text-muted-foreground mb-4'>El vehículo que buscas no existe.</p>
              <Button onClick={() => navigate({ to: '/all-vehicles' })}>
                Volver a Vehículos
              </Button>
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: '/all-services' })}
          >
            <IconArrowLeft className='h-5 w-5' />
          </Button>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Nuevo Servicio
            </h2>
            <p className='text-muted-foreground'>
              {vehicle ? `${getVehicleFullName(vehicle)} • ${vehicle.license}` : 'Selecciona un vehículo para comenzar'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Servicio</CardTitle>
            <CardDescription>
              Registra todos los detalles del servicio o reparación realizada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                          onValueChange={handleVehicleChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Seleccionar vehículo' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockVehicles.map((vehicle) => {
                              const client = mockClients.find(c => c.id === vehicle.clientId)
                              return (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  <div className='flex flex-col'>
                                    <span className='font-medium'>{getVehicleFullName(vehicle)}</span>
                                    <span className='text-xs text-muted-foreground'>
                                      {vehicle.license} • {client ? getClientFullName(client) : 'N/A'}
                                    </span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='serviceDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha del Servicio *</FormLabel>
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
                        <FormLabel>Estado *</FormLabel>
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
                                id={`type-${type}`}
                                checked={selectedTypes.includes(type)}
                                onCheckedChange={() => handleServiceTypeToggle(type)}
                              />
                              <Label
                                htmlFor={`type-${type}`}
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
                        <FormLabel>Descripción *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describe el trabajo realizado...'
                            className='resize-none'
                            rows={3}
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
                        <FormLabel>Kilometraje *</FormLabel>
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
                        <FormLabel>Técnico/Mecánico *</FormLabel>
                        <FormControl>
                          <Input placeholder='Nombre del técnico' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <FormLabel>Repuestos Utilizados</FormLabel>
                      <p className='text-sm text-muted-foreground'>
                        Agrega los repuestos o piezas utilizadas en este servicio
                      </p>
                    </div>
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

                  {fields.length > 0 && (
                    <div className='space-y-2'>
                      <div className='grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground'>
                        <div className='col-span-4'>Nombre del Repuesto</div>
                        <div className='col-span-2'>Cantidad</div>
                        <div className='col-span-3'>Precio Unit.</div>
                        <div className='col-span-2 text-right'>Subtotal</div>
                        <div className='col-span-1'></div>
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
                                    <Input placeholder='Ej: Filtro de aceite' {...field} />
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
                                    <Input type='number' placeholder='1' {...field} />
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
                                    <Input type='number' step='0.01' placeholder='0.00' {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className='col-span-2 flex items-center justify-end pt-2'>
                            <span className='text-sm font-semibold'>
                              ${((parts[index]?.quantity || 0) * (parts[index]?.unitPrice || 0)).toFixed(2)}
                            </span>
                          </div>
                          <div className='col-span-1 flex items-center justify-center'>
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
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='laborCost'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Costo de Mano de Obra *</FormLabel>
                        <FormControl>
                          <Input type='number' step='0.01' placeholder='0.00' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex items-end'>
                    <div className='flex-1 p-4 bg-muted rounded-md border-2 border-primary/20'>
                      <p className='text-sm font-medium text-muted-foreground'>Costo Total</p>
                      <p className='text-3xl font-bold text-primary'>${totalCost.toFixed(2)}</p>
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
                            placeholder='Observaciones, recomendaciones o cualquier información adicional...'
                            className='resize-none'
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => navigate({ to: '/all-services' })}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit'>
                    Registrar Servicio
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
