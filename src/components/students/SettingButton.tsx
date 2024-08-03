import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Cog } from "lucide-react"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { useTableStore } from "@/store/table"

export default function SettingButton() {
  const tableCols = useTableStore((state) => state.tableCols)
  const setIsActive = useTableStore((state) => state.setIsActive)

  const handleCheckboxChange = (
    checkedState: CheckedState,
    columnId: number
  ) => {
    console.log(typeof checkedState)
    console.log(tableCols)
    // setTableCols((prev) =>
    //   prev.map((col) =>
    //     col.id === columnId ? { ...col, isActive: !checkedState } : col
    //   )
    // )
    setIsActive(columnId)
  }

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
          {tableCols.map((column) => (
            <div className='flex items-center gap-3' key={column.id}>
              <Checkbox
                className='border-green-700 bg-transparent data-[state=checked]:bg-green-200 data-[state=checked]:text-inherit text-green-700'
                checked={column.isActive}
                onCheckedChange={(e) => void handleCheckboxChange(e, column.id)}
              />
              <Label htmlFor={String(column.id)} className='font-medium'>
                {column.title}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
