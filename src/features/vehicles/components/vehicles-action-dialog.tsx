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
import { useVehicles } from './vehicles-provider'
import { vehicleTypeLabels, fuelTypeLabels } from '@/types'

const vehicleSchema = z.object({
  brand: z.string().min(1, 'La marca es requerida'),
  model: z.string().min(1, 'El modelo es requerido'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  license: z.string().min(1, 'La patente es requerida'),
  color: z.string().min(1, 'El color es requerido'),
  vehicleType: z.enum(['car', 'truck', 'motorcycle', 'suv', 'van']),
  currentMileage: z.coerce.number().min(0, 'El kilometraje debe ser positivo'),
  fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid', 'gas']),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

export function VehiclesActionDialog() {
  const { open, setOpen, currentVehicle, clientId } = useVehicles()
  const isEditing = open === 'update'

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      license: '',
      color: '',
      vehicleType: 'car',
      currentMileage: 0,
      fuelType: 'gasoline',
    },
  })

  useEffect(() => {
    if (currentVehicle && isEditing) {
      form.reset({
        brand: currentVehicle.brand,
        model: currentVehicle.model,
        year: currentVehicle.year,
        license: currentVehicle.license,
        color: currentVehicle.color,
        vehicleType: currentVehicle.vehicleType,
        currentMileage: currentVehicle.currentMileage,
        fuelType: currentVehicle.fuelType,
      })
    } else {
      form.reset({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        license: '',
        color: '',
        vehicleType: 'car',
        currentMileage: 0,
        fuelType: 'gasoline',
      })
    }
  }, [currentVehicle, isEditing, form])

  const onSubmit = async (data: VehicleFormValues) => {
    console.log('Submitting vehicle:', { ...data, clientId })
    // TODO: Implement GraphQL mutation
    handleClose()
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
              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Toyota' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Corolla' {...field} />
                    </FormControl>
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
                name='color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Blanco' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='currentMileage'
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
                        {Object.entries(vehicleTypeLabels).map(([key, label]) => (
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
                name='fuelType'
                render={({ field }) => (
                  <FormItem>
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
                        {Object.entries(fuelTypeLabels).map(([key, label]) => (
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
