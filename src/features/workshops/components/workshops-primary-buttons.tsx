import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkshops } from './workshops-provider'

export function WorkshopsPrimaryButtons() {
  const { setOpen, setCurrentWorkshop } = useWorkshops()

  const handleCreate = () => {
    setCurrentWorkshop(null)
    setOpen('create')
  }

  return (
    <Button onClick={handleCreate}>
      <Plus className='mr-2 h-4 w-4' />
      Nuevo Taller
    </Button>
  )
}
