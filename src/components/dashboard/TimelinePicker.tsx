import { ChevronDownIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Button } from "../ui/button"

function TimelinePicker() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='ml-auto'>
          Daily{" "}
          <ChevronDownIcon className='ml-2 h-4 w-4 text-muted-foreground' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' align='end'>
        <Command>
          <CommandInput placeholder='Select new filter...' />
          <CommandList>
            <CommandEmpty>No filters found.</CommandEmpty>
            <CommandGroup>
              <CommandItem className='teamaspace-y-1 flex flex-col items-start px-4 py-2'>
                <p>Daily</p>
                <p className='text-sm text-muted-foreground'>
                  Filter to daily.
                </p>
              </CommandItem>
              <CommandItem className='teamaspace-y-1 flex flex-col items-start px-4 py-2'>
                <p>Monthly</p>
                <p className='text-sm text-muted-foreground'>
                  Filter to monthly.
                </p>
              </CommandItem>
              <CommandItem className='teamaspace-y-1 flex flex-col items-start px-4 py-2'>
                <p>Yearly</p>
                <p className='text-sm text-muted-foreground'>
                  Filter to yearly.
                </p>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TimelinePicker
