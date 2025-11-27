import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ConfigDrawer } from '@/components/config-drawer'
import { VehicleDetailSheet } from '@/features/vehicles/components/vehicle-detail-sheet'
import { VehiclesProvider } from '@/features/vehicles/components/vehicles-provider'
import { VehiclesDialogs } from '@/features/vehicles/components/vehicles-dialogs'
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
import { mockVehicles, mockClients } from '@/data/mock-data'
import { Vehicle, getVehicleFullName, vehicleTypeLabels, fuelTypeLabels, getClientFullName } from '@/types'
import { useVehicles } from '@/features/vehicles/components/vehicles-provider'

const columns: ColumnDef<Vehicle>[] = [
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
    accessorKey: 'vehicle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vehículo' />
    ),
    cell: ({ row }) => {
      const vehicle = row.original
      return (
        <div>
          <p className='font-medium'>{getVehicleFullName(vehicle)}</p>
          <p className='text-sm text-muted-foreground'>{vehicle.color}</p>
        </div>
      )
    },
  },
  {
    accessorKey: 'license',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Patente' />
    ),
    cell: ({ row }) => (
      <span className='font-mono font-semibold'>{row.getValue('license')}</span>
    ),
  },
  {
    accessorKey: 'clientId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Propietario' />
    ),
    cell: ({ row }) => {
      const clientId = row.getValue('clientId') as string
      const client = mockClients.find(c => c.id === clientId)
      return <div>{client ? getClientFullName(client) : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'vehicleType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('vehicleType') as keyof typeof vehicleTypeLabels
      return (
        <Badge variant='outline'>
          {vehicleTypeLabels[type]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'fuelType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Combustible' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('fuelType') as keyof typeof fuelTypeLabels
      return (
        <Badge variant='secondary'>
          {fuelTypeLabels[type]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'currentMileage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kilometraje' />
    ),
    cell: ({ row }) => {
      const mileage = row.getValue('currentMileage') as number
      return <div>{mileage.toLocaleString()} km</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <VehicleActionsCell vehicleId={row.original.id} />
    },
    meta: {
      className: 'w-[80px]',
    },
  },
]

function VehicleActionsCell({ vehicleId }: { vehicleId: string }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const { setOpen, setCurrentVehicle } = useVehicles()
  const vehicle = mockVehicles.find(v => v.id === vehicleId)

  const handleEdit = () => {
    if (vehicle) {
      setCurrentVehicle(vehicle)
      setOpen('update')
    }
  }

  const handleDelete = () => {
    if (vehicle) {
      setCurrentVehicle(vehicle)
      setOpen('delete')
    }
  }

  return (
    <>
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
          <DropdownMenuItem onClick={() => setSheetOpen(true)}>
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
      <VehicleDetailSheet
        vehicleId={vehicleId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}

function AddVehicleButton() {
  const { setOpen, setCurrentVehicle } = useVehicles()

  const handleClick = () => {
    setCurrentVehicle(null)
    setOpen('create')
  }

  return (
    <Button onClick={handleClick} className='gap-2'>
      <IconPlus size={18} />
      Agregar Vehículo
    </Button>
  )
}

export default function AllVehiclesPage() {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])

  const table = useReactTable({
    data: mockVehicles,
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
    <VehiclesProvider clientId="">
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
            <h2 className='text-2xl font-bold tracking-tight'>Todos los Vehículos</h2>
            <p className='text-muted-foreground'>
              Vista general de todos los vehículos registrados en el sistema.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>{mockVehicles.length} vehículos</Badge>
            <AddVehicleButton />
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder='Buscar vehículos por patente...'
            searchKey='license'
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
                      No se encontraron vehículos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} className='mt-auto' />
        </div>
      </Main>

      <VehiclesDialogs />
    </VehiclesProvider>
  )
}
