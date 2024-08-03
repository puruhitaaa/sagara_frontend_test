"use client"
// type TOpenModal = (student?: User) => void

import { User, CompleteUser } from "@/lib/db/schema/auth"
import { useState } from "react"
import { MoreHorizontal, PlusIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import AddButton from "./AddButton"
import { Input } from "../ui/input"
import SettingButton from "./SettingButton"
import useSearch from "@/lib/hooks/useSearch"
import { useTableStore } from "@/store/table"

type TOpenModal = (student?: User) => void

export default function StudentList() {
  const [open, setOpen] = useState(false)
  const [activeStudent, setActiveStudent] = useState<User | null>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const { getParam } = useSearch()
  const tableCols = useTableStore((state) => state.tableCols)

  const activeColumns = tableCols
    .filter((col) => col.isActive)
    .map((col) => col.title.toLowerCase().replace(/ /g, ""))

  const {
    data,
    isLoading: loadingUsers,
    // error: errorUsers,
  } = trpc.users.getUsers.useQuery(
    {
      limit: 6,
      page: getParam("page") ?? 1,
      activeColumns,
    },
    { refetchOnWindowFocus: false }
  )

  const openModal = (student?: User) => {
    setOpen(true)
    student ? setActiveStudent(student) : setActiveStudent(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div className='overflow-x-hidden flex flex-col gap-4 py-2'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3'>
          <FilterButton />
          <AddButton />
        </div>

        <div className='flex items-center gap-3'>
          <div
            className={cn(
              "rounded-md bg-background inline-flex items-center gap-1 min-w-80 border border-border",
              { "bg-brand-background": isInputFocused }
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
      {/* <Modal
        open={open}
        setOpen={setOpen}
        title={activeStudent ? "Edit Student" : "Create Student"}
      >
        <StudentForm
          student={activeStudent}
          addOptimistic={addOptimisticStudent}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal> */}
      {!loadingUsers && data?.users ? (
        data.users.length === 0 ? (
          <EmptyState openModal={openModal} />
        ) : (
          <div className='border overflow-x-auto'>
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
                </TableRow>
              </TableHeader>
              <TableBody className='last:border-b border-border'>
                {data.users.map((user) => (
                  <Student student={user} key={user.id} openModal={openModal} />
                ))}
              </TableBody>
            </Table>
            <nav className='flex items-center justify-between px-4 py-3 bg-background'>
              <Button variant='outline' size='sm' className='rounded-md'>
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
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-md text-muted-foreground'
                >
                  1
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-md text-muted-foreground'
                >
                  2
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-md text-muted-foreground'
                >
                  3
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-md text-muted-foreground'
                >
                  4
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-md text-muted-foreground'
                >
                  5
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-md text-muted-foreground'
                >
                  6
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-md text-muted-foreground'
                >
                  7
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-md text-muted-foreground'
                >
                  <MoreHorizontal className='h-5 w-5' />
                </Button>
              </div>
              <Button variant='outline' size='sm' className='rounded-md'>
                Next
              </Button>
            </nav>
          </div>
        )
      ) : null}
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
    </TableRow>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>
        No student
      </h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        Get started by creating a new student.
      </p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Student{" "}
        </Button>
      </div>
    </div>
  )
}
