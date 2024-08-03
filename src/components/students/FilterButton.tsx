import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { ChevronDown, ListFilter } from "lucide-react"
import { Input } from "../ui/input"

function FilterButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-fit inline-flex gap-2 items-center'
        >
          <ListFilter className='h-4 w-4' />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-4 grid gap-4'>
        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full inline-flex gap-2 items-center justify-between'
              >
                Instance
                <ChevronDown className='w-4 h-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-2 grid gap-2'>
              <div>All</div>
              <div>Production</div>
              <div>Staging</div>
              <div>Development</div>
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex items-center gap-2'>
          <Input disabled placeholder='is' className='flex-1' />
        </div>
        <div className='flex items-center gap-2'>
          <Input placeholder='enter condition' className='flex-1' />
        </div>
        <Button className='bg-brand-red hover:bg-brand-red/80 dark:text-foreground'>
          Add Filter
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default FilterButton
