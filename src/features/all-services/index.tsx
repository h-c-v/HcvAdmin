import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { IconPlus, IconDotsVertical, IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar, DataTableColumnHeader } from '@/components/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from '@tanstack/react-router'
import { mockServices, mockVehicles } from '@/data/mock-data'
import { Service, serviceStatusLabels, serviceStatusColors, getVehicleFullName } from '@/types'
import { format } from 'date-fns'
import { ServicesProvider, useServices } from '@/features/services/components/services-provider'
import { ServicesDialogs } from '@/features/services/components/services-dialogs'

const columns: ColumnDef<Service>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[50px]',
    },
  },
  {
    accessorKey: 'serviceDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('serviceDate') as string
      return <div>{format(new Date(date), 'dd/MM/yyyy')}</div>
    },
  },
  {
    accessorKey: 'vehicleId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vehículo' />
    ),
    cell: ({ row }) => {
      const vehicleId = row.getValue('vehicleId') as string
      const vehicle = mockVehicles.find(v => v.id === vehicleId)
      return (
        <div>
          <p className='font-medium'>{vehicle ? getVehicleFullName(vehicle) : 'N/A'}</p>
          <p className='text-sm text-muted-foreground font-mono'>
            {vehicle?.license}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'serviceType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo de Servicio' />
    ),
    cell: ({ row }) => {
      const service = row.original
      return (
        <div>
          <p className='font-medium'>{service.serviceType}</p>
          <p className='text-sm text-muted-foreground truncate max-w-[200px]'>
            {service.description}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'technicianName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Técnico' />
    ),
    cell: ({ row }) => <div>{row.getValue('technicianName')}</div>,
  },
  {
    accessorKey: 'mileage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kilometraje' />
    ),
    cell: ({ row }) => {
      const mileage = row.getValue('mileage') as number
      return <div>{mileage.toLocaleString()} km</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof serviceStatusLabels
      return (
        <Badge variant={serviceStatusColors[status]}>
          {serviceStatusLabels[status]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return Array.isArray(value) && value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'totalCost',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Costo' />
    ),
    cell: ({ row }) => {
      const cost = row.getValue('totalCost') as number
      return <div className='font-semibold'>${cost.toFixed(2)}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <ServiceActionsCell service={row.original} />
    },
    meta: {
      className: 'w-[80px]',
    },
  },
]

function ServiceActionsCell({ service }: { service: Service }) {
  const { setOpen, setCurrentService } = useServices()

  const handleView = () => {
    setCurrentService(service)
    setOpen('view')
  }

  const handleEdit = () => {
    setCurrentService(service)
    setOpen('update')
  }

  const handleDelete = () => {
    setCurrentService(service)
    setOpen('delete')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <IconDotsVertical className='h-4 w-4' />
          <span className='sr-only'>Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>
          <IconEye className='me-2 h-4 w-4' />
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <IconEdit className='me-2 h-4 w-4' />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
          <IconTrash className='me-2 h-4 w-4' />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NewServiceButton() {
  const navigate = useNavigate()

  const handleNewService = () => {
    navigate({ to: '/vehicles/new-service' })
  }

  return (
    <Button
      className='gap-2'
      onClick={handleNewService}
    >
      <IconPlus size={18} />
      Nuevo Servicio
    </Button>
  )
}

export default function AllServicesPage() {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'serviceDate', desc: true }
  ])
  const [columnFilters, setColumnFilters] = useState<any[]>([])

  // Calcular estadísticas
  const totalRevenue = mockServices
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.totalCost, 0)

  const completedServices = mockServices.filter(s => s.status === 'completed').length
  const pendingServices = mockServices.filter(s => s.status === 'pending').length
  const inProgressServices = mockServices.filter(s => s.status === 'in_progress').length

  const table = useReactTable({
    data: mockServices,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <ServicesProvider vehicleId="">
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Historial de Servicios</h2>
            <p className='text-muted-foreground'>
              Vista general de todos los servicios realizados en el sistema.
            </p>
          </div>
          <NewServiceButton />
        </div>

        <div className='grid gap-4 md:grid-cols-4'>
          <div className='rounded-lg border bg-card p-4'>
            <p className='text-sm font-medium text-muted-foreground'>Total Servicios</p>
            <p className='text-2xl font-bold'>{mockServices.length}</p>
          </div>
          <div className='rounded-lg border bg-card p-4'>
            <p className='text-sm font-medium text-muted-foreground'>Completados</p>
            <p className='text-2xl font-bold text-green-600'>{completedServices}</p>
          </div>
          <div className='rounded-lg border bg-card p-4'>
            <p className='text-sm font-medium text-muted-foreground'>En Proceso</p>
            <p className='text-2xl font-bold text-blue-600'>{inProgressServices}</p>
          </div>
          <div className='rounded-lg border bg-card p-4'>
            <p className='text-sm font-medium text-muted-foreground'>Ingresos Totales</p>
            <p className='text-2xl font-bold text-green-600'>${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder='Buscar servicios...'
            searchKey='serviceType'
            filters={[
              {
                columnId: 'status',
                title: 'Estado',
                options: [
                  { label: 'Completado', value: 'completed' },
                  { label: 'Pendiente', value: 'pending' },
                  { label: 'En Progreso', value: 'in_progress' },
                  { label: 'Cancelado', value: 'cancelled' },
                ],
              },
            ]}
          />
          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className='group/row'>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                          header.column.columnDef.meta?.className,
                          header.column.columnDef.meta?.thClassName
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className='group/row'
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                            cell.column.columnDef.meta?.className,
                            cell.column.columnDef.meta?.tdClassName
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No se encontraron servicios.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} className='mt-auto' />
        </div>
      </Main>

      <ServicesDialogs />
    </ServicesProvider>
  )
}
