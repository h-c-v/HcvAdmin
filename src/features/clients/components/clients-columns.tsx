import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { Client, getClientFullName } from '@/types'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const clientsColumns: ColumnDef<Client>[] = [
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
      <DataTableColumnHeader column={column} title='Nombre Completo' />
    ),
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className='font-medium hover:underline cursor-pointer'>
          {getClientFullName(client)}
        </div>
      )
    },
  },
  {
    accessorKey: 'dni',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DNI/Cédula' />
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
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dirección' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate'>{row.getValue('address')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha de Registro' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return <div>{format(new Date(date), 'dd/MM/yyyy')}</div>
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
