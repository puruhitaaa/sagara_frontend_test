import useSearch from "@/lib/hooks/useSearch"
import { useState } from "react"
import { Button } from "../ui/button"
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react"

function SortButton({ title }: { title: string }) {
  const [isAsc, setIsAsc] = useState<boolean | undefined>(undefined)
  const { setParam } = useSearch()
  let name = ""

  const splitName = title.split(" ").join("").toLowerCase()

  switch (splitName) {
    case "profile":
      name = "name"
      break
    case "emailaddress":
      name = "email"
      break
    case "phonenumber":
      name = "phoneNumber"
      break
    case "instance":
      name = "instance"
      break
    case "createdat":
      name = "createdAt"
      break
  }

  const value = () => {
    if (isAsc === undefined) {
      return "desc"
    } else if (!isAsc) {
      return "asc"
    } else if (isAsc) {
      return "desc"
    } else {
      return ""
    }
  }

  const handleSortClick = () => {
    setIsAsc(isAsc === undefined ? false : !isAsc)
    setParam(name, value())
  }

  return (
    <Button
      className='inline-flex gap-2'
      onClick={handleSortClick}
      type='button'
      variant={"ghost"}
    >
      {title}
      {isAsc === undefined ? (
        <ArrowDownUp className='h4 w-4' />
      ) : !isAsc ? (
        <ArrowDown className='h-4 w-4' />
      ) : (
        <ArrowUp className='h-4 w-4' />
      )}
    </Button>
  )
}
export default SortButton
