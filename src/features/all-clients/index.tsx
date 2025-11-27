import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ConfigDrawer } from '@/components/config-drawer'
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
import { Button } from '@/components/ui/button'
import { IconPlus, IconDotsVertical, IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { mockClients, mockCustomers } from '@/data/mock-data'
import { Client, getClientFullName } from '@/types'
import { format } from 'date-fns'
import { ClientsProvider, useClients } from '@/features/clients/components/clients-provider'
import { ClientsDialogs } from '@/features/clients/components/clients-dialogs'

const columns: ColumnDef<Client>[] = [
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
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cliente' />
    ),
    cell: ({ row }) => {
      const client = row.original
      return <div className='font-medium'>{getClientFullName(client)}</div>
    },
  },
  {
    accessorKey: 'customerId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Taller' />
    ),
    cell: ({ row }) => {
      const customerId = row.getValue('customerId') as string
      const customer = mockCustomers.find(c => c.id === customerId)
      return <div>{customer?.businessName || 'N/A'}</div>
    },
  },
  {
    accessorKey: 'dni',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DNI' />
    ),
    cell: ({ row }) => <div>{row.getValue('dni')}</div>,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Teléfono' />
    ),
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Registrado' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return <div>{format(new Date(date), 'dd/MM/yyyy')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <ClientActionsCell client={row.original} />
    },
    meta: {
      className: 'w-[80px]',
    },
  },
]

function ClientActionsCell({ client }: { client: Client }) {
  const { setOpen, setCurrentClient } = useClients()
  const navigate = useNavigate()

  const handleView = () => {
    navigate({ to: `/customers/${client.customerId}/clients/${client.id}` })
  }

  const handleEdit = () => {
    setCurrentClient(client)
    setOpen('update')
  }

  const handleDelete = () => {
    setCurrentClient(client)
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

function NewClientButton() {
  const { setOpen, setCurrentClient } = useClients()

  const handleClick = () => {
    setCurrentClient(null)
    setOpen('create')
  }

  return (
    <Button onClick={handleClick} className='gap-2'>
      <IconPlus size={18} />
      Nuevo Cliente
    </Button>
  )
}

export default function AllClientsPage() {
  const navigate = useNavigate()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])

  const table = useReactTable({
    data: mockClients,
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
    <ClientsProvider customerId="">
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
            <h2 className='text-2xl font-bold tracking-tight'>Todos los Clientes</h2>
            <p className='text-muted-foreground'>
              Vista general de todos los clientes registrados en el sistema.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>{mockClients.length} clientes</Badge>
            <NewClientButton />
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder='Buscar clientes...'
            searchKey='fullName'
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
                      className='group/row cursor-pointer'
                      onClick={() => navigate({ to: `/customers/${row.original.customerId}/clients/${row.original.id}` })}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                            cell.column.columnDef.meta?.className,
                            cell.column.columnDef.meta?.tdClassName
                          )}
                          onClick={(e) => {
                            if (cell.column.id === 'select' || cell.column.id === 'actions') {
                              e.stopPropagation()
                            }
                          }}
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
                      No se encontraron clientes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} className='mt-auto' />
        </div>
      </Main>

      <ClientsDialogs />
    </ClientsProvider>
  )
}
