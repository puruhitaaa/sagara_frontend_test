"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Pencil, Plus } from "lucide-react"
import { RouterOutput, trpc } from "@/lib/trpc/client"
import { useForm } from "react-hook-form"
import { newUserSchema } from "@/lib/db/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { toast } from "sonner"

export default function StudentModal({
  student,
}: {
  student?: RouterOutput["users"]["getUsers"]["users"][number]
}) {
  const [open, setOpen] = useState(false)
  const closeModal = () => setOpen(false)
  const editing = !!student?.id

  const utils = trpc.useUtils()

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: student?.id
      ? { ...student, password: "", confirmationPassword: "" }
      : {
          name: "",
          email: "",
          phoneNumber: "",
          instanceId: "",
        },
  })

  const { data: instancesData, isLoading: loadingInstances } =
    trpc.instances.getInstances.useQuery()
  const { mutate: createUser } = trpc.users.createUser.useMutation()
  const { mutate: updateUser } = trpc.users.updateUser.useMutation()

  function onSubmit(data: z.infer<typeof newUserSchema>) {
    if (editing) {
      updateUser(
        { ...data, id: student.id },
        {
          onSuccess: async () => {
            closeModal()
            toast.success("User updated successfully!")
            form.reset()
            await utils.users.getUsers.invalidate()
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )
    } else {
      createUser(data, {
        onSuccess: async () => {
          closeModal()
          toast.success("User created successfully!")
          form.reset()
          await utils.users.getUsers.invalidate()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!editing ? (
          <Button className='md:w-fit w-full inline-flex gap-2 items-center dark:text-foreground bg-brand-red hover:bg-brand-red/80 text-background'>
            <Plus className='h-4 w-4' />
            Add Student
          </Button>
        ) : (
          <Button variant='ghost' size='icon'>
            <Pencil className='h-4 w-4 text-yellow-500' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {!editing ? "Add new" : "Edit Data"} Student
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className='grid grid-cols-2 gap-4 py-4'
            onSubmit={form.handleSubmit(onSubmit)}
            id='user-form'
          >
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type='tel' {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='instanceId'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Instance</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? ""}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select instance' />
                        </SelectTrigger>
                        <SelectContent>
                          {!loadingInstances ? (
                            instancesData?.instances.map((instance) => (
                              <SelectItem key={instance.id} value={instance.id}>
                                {instance.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value='option1'>Loading...</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmationPassword'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Re-type Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            className='bg-brand-red dark:text-foreground text-background hover:bg-brand-red/80'
            type='submit'
            form='user-form'
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              !form.formState.isDirty
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
