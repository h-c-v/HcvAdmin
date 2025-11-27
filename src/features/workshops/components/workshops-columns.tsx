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
    accessorKey: 'businessName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre del Negocio' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('businessName')}</div>
    ),
  },
  {
    accessorKey: 'taxId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CUIT' />
    ),
    cell: ({ row }) => <div>{row.getValue('taxId')}</div>,
  },
  {
    accessorKey: 'ownerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Encargado' />
    ),
    cell: ({ row }) => <div>{row.getValue('ownerName')}</div>,
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
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? 'Activo' : 'Inactivo'}
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
