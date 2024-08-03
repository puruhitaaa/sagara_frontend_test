"use client"
// type TOpenModal = (student?: User) => void

import { User, CompleteUser } from "@/lib/db/schema/auth"
import { useState } from "react"
import { MoreHorizontal, PlusIcon, Search, Trash } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, getInitials } from "@/lib/utils"
import { trpc } from "@/lib/trpc/client"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import SortButton from "./SortButton"
import FilterButton from "./FilterButton"
import { Input } from "../ui/input"
import SettingButton from "./SettingButton"
import useSearch from "@/lib/hooks/useSearch"
import { useTableStore } from "@/store/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import StudentModal from "./StudentModal"
import { Skeleton } from "../ui/skeleton"

type TOpenModal = (student?: User) => void

const basePage = 1

export default function StudentList() {
  const [open, setOpen] = useState(false)
  const [activeStudent, setActiveStudent] = useState<User | null>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const { setParam, getParam } = useSearch()
  const tableCols = useTableStore((state) => state.tableCols)

  const activeColumns = tableCols
    .filter((col) => col.isActive)
    .map((col) => col.title.toLowerCase().replace(/ /g, ""))

  const { data, isLoading: loadingUsers } = trpc.users.getUsers.useQuery(
    {
      limit: 6,
      page: getParam("page")
        ? parseInt(getParam("page")!) < 1
          ? basePage
          : parseInt(getParam("page")!)
        : basePage,
      activeColumns,
    },
    { refetchOnWindowFocus: false }
  )

  const openModal = (student?: User) => {
    setOpen(true)
    student ? setActiveStudent(student) : setActiveStudent(null)
  }
  const closeModal = () => setOpen(false)

  const handleClickPrevious = () => {
    setParam("page", (parseInt(getParam("page")! ?? 1) - 1).toString())
  }

  const handleClickNext = () => {
    setParam("page", (parseInt(getParam("page")! ?? 1) + 1).toString())
  }

  return (
    <div className='overflow-x-hidden flex flex-col gap-4 py-2'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div className='flex flex-col md:flex-row md:items-center gap-3 w-full'>
          <FilterButton />
          <StudentModal />
        </div>

        <div className='flex items-center gap-3 justify-between md:justify-normal'>
          <div
            className={cn(
              "rounded-md bg-background inline-flex items-center gap-1 min-w-80 border border-border",
              { "bg-brand-background dark:bg-black/50": isInputFocused }
            )}
          >
            <Button className='ml-1' variant='ghost' size='sm'>
              <Search className='h-4 w-4' />
            </Button>
            <Input
              className='bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0 border-none'
              placeholder='Search'
              onFocus={() => void setIsInputFocused(true)}
              onBlur={() => void setIsInputFocused(false)}
            />
          </div>

          <SettingButton />
        </div>
      </div>

      {!loadingUsers && data?.users ? (
        data.users.length === 0 ? null : (
          <div className='border'>
            <Table>
              <TableHeader className='bg-brand-background dark:bg-background'>
                <TableRow>
                  {tableCols
                    .filter((col) => col.isActive)
                    .map((col) => (
                      <TableHead key={String(col.id)}>
                        <SortButton title={col.title} />
                      </TableHead>
                    ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='last:border-b border-border'>
                {data.users.map((user) => (
                  <Student student={user} key={user.id} openModal={openModal} />
                ))}
              </TableBody>
            </Table>
            <nav className='flex items-center justify-between px-4 py-3 bg-background'>
              <Button
                variant='outline'
                size='sm'
                className='rounded-md'
                onClick={handleClickPrevious}
                disabled={!getParam("page") || getParam("page") === "1"}
              >
                Previous
              </Button>

              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-md text-muted-foreground'
                >
                  <MoreHorizontal className='h-5 w-5' />
                </Button>
                {Array.from({ length: data.totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant='ghost'
                    size='sm'
                    className='rounded-md text-muted-foreground'
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-md text-muted-foreground'
                >
                  <MoreHorizontal className='h-5 w-5' />
                </Button>
              </div>

              <Button
                variant='outline'
                size='sm'
                className='rounded-md'
                onClick={handleClickNext}
                disabled={getParam("page") === String(data.totalPages)}
              >
                Next
              </Button>
            </nav>
          </div>
        )
      ) : (
        <Skeleton className='h-96 w-full bg-muted-foreground' />
      )}
    </div>
  )
}

const Student = ({
  student,
  openModal,
}: {
  student: CompleteUser
  openModal: TOpenModal
}) => {
  const tableCols = useTableStore((state) => state.tableCols)
  const utils = trpc.useUtils()
  const { mutate: deleteUser } = trpc.users.deleteUser.useMutation()

  const handleDeleteUser = (id: string) => {
    deleteUser(
      { id },
      {
        onSuccess: async () => {
          toast.success("User deleted successfully!")
          await utils.users.getUsers.invalidate()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <TableRow>
      {tableCols
        .filter((col) => col.isActive) // Only include active columns
        .map((col) => (
          <TableCell key={col.id}>
            {col.title === "Profile" && (
              <div className='font-medium inline-flex items-center gap-6'>
                <Avatar>
                  <AvatarImage src={student.media?.url ?? ""} />
                  <AvatarFallback>
                    {student?.name ? getInitials(student?.name) : "John Doe"}
                  </AvatarFallback>
                </Avatar>
                {student.name ?? "John Doe"}
              </div>
            )}
            {col.title === "Email Address" ? student.email : null}
            {col.title === "Phone Number" ? student.phoneNumber : null}
            {col.title === "Instance" ? student.instance.name : null}
            {col.title === "Created At"
              ? student.createdAt?.toLocaleDateString()
              : null}
          </TableCell>
        ))}
      <TableCell className='flex items-center gap-3'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Trash className='h-4 w-4 text-red-500' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                selected user data!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={() => void handleDeleteUser(student.id)}
              >
                Continue
              </AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <StudentModal student={student} />
      </TableCell>
    </TableRow>
  )
}
