import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useVehicles } from './vehicles-provider'
import {
  CREATE_VEHICLE,
  GET_VEHICLES,
  GET_VEHICLE_BRANDS,
  GET_VEHICLE_MODELS,
  type CreateVehicleInput,
  type CreateVehicleResponse,
  type GetVehicleBrandsResponse,
  type GetVehicleModelsResponse,
} from '@/graphql/vehicles'

// VehicleType enum values
const vehicleTypes = ['AUTOMOVIL',
'CAMIONETA',
'MOTOCICLETA',
'SUV',
'VAN_FURGONETA'] as const
const vehicleTypeLabels: Record<string, string> = {
  AUTOMOVIL: 'Automóvil',
  CAMIONETA: 'Camioneta',
  MOTOCICLETA: 'Motocicleta',
  SUV: 'SUV',
  VAN_FURGONETA: 'Van',
}



// GasolineType enum values
const gasolineTypes = ['GASOLINA',
'DIESEL',
'ELECTRICO',
'HIBRIDO',
'GAS_NATURAL',
'GAS_COMPRIMIDO'] as const
const gasolineTypeLabels: Record<string, string> = {
  GASOLINA: 'Gasolina',
  DIESEL: 'Diésel',
  ELECTRICO: 'Eléctrico',
  HIBRIDO: 'Híbrido',
  GAS_NATURAL: 'Gas',
  GAS_COMPRIMIDO: 'Gas comprimido',
}

const vehicleSchema = z.object({
  vehicleBrandId: z.string().min(1, 'La marca es requerida'),
  vehicleModelId: z.string().min(1, 'El modelo es requerido'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  license: z.string().min(1, 'La patente es requerida'),
  mileage: z.coerce.number().min(0, 'El kilometraje debe ser positivo'),
  vehicleType: z.enum(vehicleTypes),
  gasolineType: z.enum(gasolineTypes),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

export function VehiclesActionDialog() {
  const { open, setOpen, currentVehicle, clientId } = useVehicles()
  const isEditing = open === 'update'
  const [openBrandCombobox, setOpenBrandCombobox] = useState(false)
  const [openModelCombobox, setOpenModelCombobox] = useState(false)

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleBrandId: '',
      vehicleModelId: '',
      year: new Date().getFullYear(),
      license: '',
      mileage: 0,
      vehicleType: 'AUTOMOVIL',
      gasolineType: 'GASOLINA',
    },
  })

  // Query para obtener marcas de vehículos
  const { data: brandsData, loading: loadingBrands } = useQuery<GetVehicleBrandsResponse>(
    GET_VEHICLE_BRANDS
  )

  // Query para obtener modelos de vehículos
  const { data: modelsData, loading: loadingModels } = useQuery<GetVehicleModelsResponse>(
    GET_VEHICLE_MODELS
  )

  const brands = brandsData?.vehicleBrands || []
  const allModels = modelsData?.vehicleModels || []

  // Filtrar modelos según la marca seleccionada
  const selectedBrandId = form.watch('vehicleBrandId')
  const filteredModels = useMemo(() => {
    if (!selectedBrandId) return allModels
    return allModels.filter((model) => model.brandId === selectedBrandId)
  }, [selectedBrandId, allModels])

  const [createVehicle, { loading }] = useMutation<CreateVehicleResponse, { input: CreateVehicleInput }>(
    CREATE_VEHICLE,
    {
      refetchQueries: [{ query: GET_VEHICLES }],
      onCompleted: () => {
        toast.success('Vehículo creado exitosamente')
        handleClose()
      },
      onError: (error) => {
        console.error('Error creating vehicle:', error)
        toast.error(`Error al crear el vehículo: ${error.message}`)
      },
    }
  )

  useEffect(() => {
    if (currentVehicle && isEditing) {
      form.reset({
        vehicleBrandId: (currentVehicle as any).vehicleBrandId || '',
        vehicleModelId: (currentVehicle as any).vehicleModelId || '',
        year: (currentVehicle as any).year || new Date().getFullYear(),
        license: (currentVehicle as any).license || '',
        mileage: (currentVehicle as any).mileage || 0,
        vehicleType: (currentVehicle as any).vehicleType || 'CAR',
        gasolineType: (currentVehicle as any).gasolineType || 'GASOLINE',
      })
    } else {
      form.reset({
        vehicleBrandId: '',
        vehicleModelId: '',
        year: new Date().getFullYear(),
        license: '',
        mileage: 0,
        vehicleType: 'CAR',
        gasolineType: 'GASOLINE',
      })
    }
  }, [currentVehicle, isEditing, form])

  // Limpiar modelo seleccionado cuando cambie la marca
  useEffect(() => {
    if (selectedBrandId) {
      const currentModelId = form.getValues('vehicleModelId')
      const modelExists = filteredModels.some((m) => m.id === currentModelId)
      if (!modelExists && currentModelId) {
        form.setValue('vehicleModelId', '')
      }
    }
  }, [selectedBrandId, filteredModels, form])

  const onSubmit = async (data: VehicleFormValues) => {
    if (isEditing) {
      toast.info('Edición de vehículos aún no implementada')
      return
    }

    await createVehicle({
      variables: {
        input: {
          vehicleBrandId: data.vehicleBrandId,
          vehicleModelId: data.vehicleModelId,
          year: data.year,
          license: data.license,
          mileage: data.mileage,
          vehicleType: data.vehicleType,
          gasolineType: data.gasolineType,
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
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información del vehículo.'
              : 'Completa la información para registrar un nuevo vehículo.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Marca - Combobox */}
              <FormField
                control={form.control}
                name='vehicleBrandId'
                render={({ field }) => (
                  <FormItem className='col-span-2 flex flex-col'>
                    <FormLabel>Marca del Vehículo</FormLabel>
                    <Popover open={openBrandCombobox} onOpenChange={setOpenBrandCombobox}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={loadingBrands}
                          >
                            {loadingBrands
                              ? 'Cargando...'
                              : field.value
                              ? brands.find((brand) => brand.id === field.value)?.name
                              : 'Seleccionar marca'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[400px] p-0'>
                        <Command>
                          <CommandInput placeholder='Buscar marca...' />
                          <CommandList>
                            <CommandEmpty>No se encontró ninguna marca.</CommandEmpty>
                            <CommandGroup>
                              {brands.map((brand) => (
                                <CommandItem
                                  value={brand.name}
                                  key={brand.id}
                                  onSelect={() => {
                                    form.setValue('vehicleBrandId', brand.id)
                                    setOpenBrandCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      brand.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {brand.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Selecciona la marca del vehículo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Modelo - Combobox */}
              <FormField
                control={form.control}
                name='vehicleModelId'
                render={({ field }) => (
                  <FormItem className='col-span-2 flex flex-col'>
                    <FormLabel>Modelo del Vehículo</FormLabel>
                    <Popover open={openModelCombobox} onOpenChange={setOpenModelCombobox}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={loadingModels || !selectedBrandId}
                          >
                            {loadingModels
                              ? 'Cargando...'
                              : field.value
                              ? filteredModels.find((model) => model.id === field.value)?.name
                              : selectedBrandId
                              ? 'Seleccionar modelo'
                              : 'Primero selecciona una marca'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[400px] p-0'>
                        <Command>
                          <CommandInput placeholder='Buscar modelo...' />
                          <CommandList>
                            <CommandEmpty>No se encontró ningún modelo.</CommandEmpty>
                            <CommandGroup>
                              {filteredModels.map((model) => (
                                <CommandItem
                                  value={model.name}
                                  key={model.id}
                                  onSelect={() => {
                                    form.setValue('vehicleModelId', model.id)
                                    setOpenModelCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      model.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {model.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Selecciona el modelo del vehículo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='2024' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='license'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patente</FormLabel>
                    <FormControl>
                      <Input placeholder='ABC123' {...field} />
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
                name='vehicleType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vehículo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar tipo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {vehicleTypeLabels[type]}
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
                name='gasolineType'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Tipo de Combustible</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar combustible' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gasolineTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {gasolineTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type='submit' disabled={loading || loadingBrands || loadingModels}>
                {loading && <Loader2 className='animate-spin' />}
                {isEditing ? 'Actualizar' : 'Crear Vehículo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
