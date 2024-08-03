import { Plus } from "lucide-react"
import { Button } from "../ui/button"

type AddButtonProps = {}

function AddButton({}: AddButtonProps) {
  return (
    <Button className='w-full inline-flex gap-2 items-center dark:text-foreground bg-brand-red hover:bg-brand-red/80 text-background'>
      <Plus className='h-4 w-4' />
      Add Student
    </Button>
  )
}

export default AddButton
