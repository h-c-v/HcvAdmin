import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import { useClients } from './clients-provider'

export function ClientsPrimaryButtons() {
  const { setOpen } = useClients()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('create')} className='gap-2'>
        <IconPlus size={18} />
        Nuevo Cliente
      </Button>
    </div>
  )
}
