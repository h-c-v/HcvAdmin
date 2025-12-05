import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import { useCustomers } from './customers-provider'

export function CustomersPrimaryButtons() {
  const { setOpen } = useCustomers()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('create')} className='gap-2'>
        <IconPlus size={18} />
        Nuevo Proveedor
      </Button>
    </div>
  )
}
