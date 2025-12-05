import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Workshop } from '@/types'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const workshopsColumns: ColumnDef<Workshop>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre del Taller' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'cuit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CUIT' />
    ),
    cell: ({ row }) => <div>{row.getValue('cuit')}</div>,
  },
  {
    accessorKey: 'manager',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Encargado' />
    ),
    cell: ({ row }) => <div>{row.getValue('manager')}</div>,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Propietario' />
    ),
    cell: ({ row }) => {
      const user = row.getValue('user') as { names: string; lastName: string } | undefined
      return user ? (
        <div>{user.names} {user.lastName}</div>
      ) : (
        <div className='text-muted-foreground'>-</div>
      )
    },
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as boolean
      return (
        <Badge variant={status ? 'default' : 'secondary'}>
          {status ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return Array.isArray(value) && value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha de Registro' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      const timestamp = !isNaN(Number(date)) ? Number(date) : date
      return <div>{format(new Date(timestamp), 'dd/MM/yyyy')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'w-[80px]',
    },
  },
]
