import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Cog } from "lucide-react"

type Props = {}

export default function SettingButton({}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon'>
          <Cog className='h-5 w-5' />
          <span className='sr-only'>Settings</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align='end' className='p-4 w-fit'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <Checkbox
              className='border-green-700 bg-transparent data-[state=checked]:bg-green-200 data-[state=checked]:text-inherit text-green-700'
              id='option1'
            />
            <Label htmlFor='option1' className='font-medium'>
              Option 1
            </Label>
          </div>

          <div className='flex items-center gap-3'>
            <Checkbox
              className='border-green-700 bg-transparent data-[state=checked]:bg-green-200 data-[state=checked]:text-inherit text-green-700'
              id='option2'
            />
            <Label htmlFor='option2' className='font-medium'>
              Option 2
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
