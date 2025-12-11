import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconPlus, IconTrash, IconArrowLeft, IconX } from '@tabler/icons-react'
import { commonServiceTypes, serviceStatusLabels } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CREATE_SERVICE, type CreateServiceInput, type CreateServiceResponse } from '@/graphql/services'
import { GET_VEHICLES, type GetVehiclesResponse } from '@/graphql/vehicles'
import { GET_WORKSHOPS, type GetWorkshopsResponse } from '@/graphql/workshops'

const servicePartSchema = z.object({
  partName: z.string().min(1, 'El nombre de la parte es requerido'),
  partCode: z.string().optional(),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  unitPrice: z.number().min(0, 'El precio debe ser positivo'),
})

const serviceSchema = z.object({
  workshopId: z.string().min(1, 'El taller es requerido'),
  vehicleId: z.string().min(1, 'Debes seleccionar un vehículo'),
  serviceDate: z.string().min(1, 'La fecha es requerida'),
  serviceTypes: z.array(z.string()).min(1, 'Selecciona al menos un tipo de servicio'),
  description: z.string().min(1, 'La descripción es requerida'),
  parts: z.array(servicePartSchema),
  laborCost: z.number().min(0, 'El costo de mano de obra debe ser positivo'),
  mileage: z.number().min(0, 'El kilometraje debe ser positivo'),
  technicianName: z.string().min(1, 'El nombre del técnico es requerido'),
  nextServiceDate: z.string().optional(),
  nextServiceMileage: z.number().optional(),
  status: z.enum(['COMPLETED', 'PENDING', 'IN_PROGRESS', 'CANCELLED']),
  notes: z.string().optional(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

export default function NewServicePage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/_authenticated/vehicles/new-service' }) as { vehicleId?: string }
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(searchParams?.vehicleId || '')
  const [openWorkshopCombobox, setOpenWorkshopCombobox] = useState(false)
  const [openVehicleCombobox, setOpenVehicleCombobox] = useState(false)

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
      status: 'IN_PROGRESS',
      notes: '',
    },
  })

  // Query para obtener talleres
  const { data: workshopsData, loading: loadingWorkshops } = useQuery<GetWorkshopsResponse>(
    GET_WORKSHOPS
  )

  // Query para obtener vehículos
  const { data: vehiclesData, loading: loadingVehicles } = useQuery<GetVehiclesResponse>(
    GET_VEHICLES
  )

  const workshops = workshopsData?.workshops || []
  const vehicles = vehiclesData?.vehicles || []
  const vehicle = vehicles.find(v => v.id === selectedVehicleId)

  // Mutation para crear servicio
  const [createService, { loading: creatingService }] = useMutation<CreateServiceResponse, { input: CreateServiceInput }>(
    CREATE_SERVICE,
    {
      onCompleted: () => {
        toast.success('Servicio registrado exitosamente')
        navigate({ to: '/all-services' })
      },
      onError: (error) => {
        console.error('Error creating service:', error)
        toast.error(`Error al registrar el servicio: ${error.message}`)
      },
    }
  )

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'parts',
  })

  const parts = form.watch('parts')
  const laborCost = form.watch('laborCost')

  const totalCost = parts.reduce((sum, part) => {
    const quantity = Number(part.quantity) || 0
    const unitPrice = Number(part.unitPrice) || 0
    return sum + (quantity * unitPrice)
  }, 0) + (Number(laborCost) || 0)

  useEffect(() => {
    if (vehicle) {
      form.setValue('mileage', vehicle.mileage)
    }
  }, [vehicle, form])

  const onSubmit = async (data: ServiceFormValues) => {
    await createService({
      variables: {
        input: {
          workshopId: data.workshopId,
          vehicleId: data.vehicleId,
          serviceDate: data.serviceDate,
          serviceTypes: data.serviceTypes,
          description: data.description,
          parts: data.parts.map(part => ({
            partName: part.partName,
            partCode: part.partCode,
            quantity: part.quantity,
            unitPrice: part.unitPrice,
          })),
          laborCost: data.laborCost,
          mileage: data.mileage,
          technicianName: data.technicianName,
          nextServiceDate: data.nextServiceDate || undefined,
          nextServiceMileage: data.nextServiceMileage || undefined,
          status: data.status,
          notes: data.notes,
        },
      },
    })
  }

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
    const selectedVehicle = vehicles.find(v => v.id === vehicleId)
    if (selectedVehicle) {
      form.setValue('mileage', selectedVehicle.mileage)
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
              {vehicle ? `${vehicle.vehicleBrand.name} ${vehicle.vehicleModel.name} ${vehicle.year} • ${vehicle.license}` : 'Selecciona un vehículo para comenzar'}
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
                  {/* Taller - Combobox */}
                  <FormField
                    control={form.control}
                    name='workshopId'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Taller *</FormLabel>
                        <Popover open={openWorkshopCombobox} onOpenChange={setOpenWorkshopCombobox}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                                disabled={loadingWorkshops}
                              >
                                {loadingWorkshops
                                  ? 'Cargando...'
                                  : field.value
                                  ? workshops.find((workshop) => workshop.id === field.value)?.name
                                  : 'Seleccionar taller'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[400px] p-0'>
                            <Command>
                              <CommandInput placeholder='Buscar taller...' />
                              <CommandList>
                                <CommandEmpty>No se encontró ningún taller.</CommandEmpty>
                                <CommandGroup>
                                  {workshops.map((workshop) => (
                                    <CommandItem
                                      value={workshop.name}
                                      key={workshop.id}
                                      onSelect={() => {
                                        form.setValue('workshopId', workshop.id)
                                        setOpenWorkshopCombobox(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          workshop.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {workshop.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Vehículo - Combobox */}
                  <FormField
                    control={form.control}
                    name='vehicleId'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Vehículo *</FormLabel>
                        <Popover open={openVehicleCombobox} onOpenChange={setOpenVehicleCombobox}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                                disabled={loadingVehicles}
                              >
                                {loadingVehicles
                                  ? 'Cargando...'
                                  : field.value
                                  ? (() => {
                                      const v = vehicles.find((vehicle) => vehicle.id === field.value)
                                      return v ? `${v.vehicleBrand.name} ${v.vehicleModel.name} • ${v.license}` : 'Seleccionar vehículo'
                                    })()
                                  : 'Seleccionar vehículo'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[400px] p-0'>
                            <Command>
                              <CommandInput placeholder='Buscar vehículo por patente...' />
                              <CommandList>
                                <CommandEmpty>No se encontró ningún vehículo.</CommandEmpty>
                                <CommandGroup>
                                  {vehicles.map((vehicle) => (
                                    <CommandItem
                                      value={`${vehicle.license} ${vehicle.vehicleBrand.name} ${vehicle.vehicleModel.name}`}
                                      key={vehicle.id}
                                      onSelect={() => {
                                        handleVehicleChange(vehicle.id)
                                        setOpenVehicleCombobox(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          vehicle.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className='flex flex-col'>
                                        <span className='font-medium'>
                                          {vehicle.vehicleBrand.name} {vehicle.vehicleModel.name} {vehicle.year}
                                        </span>
                                        <span className='text-xs text-muted-foreground'>
                                          {vehicle.license}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                          <Input
                            type='number'
                            step='0.01'
                            placeholder='0.00'
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                              }
                            }}
                          />
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
                    disabled={creatingService}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' disabled={creatingService || loadingWorkshops || loadingVehicles}>
                    {creatingService && <Loader2 className='animate-spin' />}
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
