"use client"

import { User, NewUserParams, insertUserParams } from "@/lib/db/schema/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { trpc } from "@/lib/trpc/client"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const StudentForm = ({
  user,
  closeModal,
}: {
  user?: User
  closeModal?: () => void
}) => {
  const editing = !!user?.id

  const router = useRouter()
  const utils = trpc.useUtils()

  const form = useForm<z.infer<typeof insertUserParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertUserParams),
    defaultValues:
      user ??
      {
        // type: "",
        // url: "",
        // description: "",
      },
  })

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error)
      return
    }

    await utils.users.getUsers.invalidate()
    router.refresh()
    if (closeModal) closeModal()
    toast.success(`Student ${action}d!`)
  }

  const { mutate: createUser, isLoading: isCreating } =
    trpc.users.createUser.useMutation({
      onSuccess: (res) => onSuccess("create"),
      onError: (err) => onSuccess("create", { error: err.message }),
    })

  const { mutate: updateUser, isLoading: isUpdating } =
    trpc.users.updateUser.useMutation({
      onSuccess: (res) => onSuccess("update"),
      onError: (err) => onSuccess("update", { error: err.message }),
    })

  const { mutate: deleteUser, isLoading: isDeleting } =
    trpc.users.deleteUser.useMutation({
      onSuccess: (res) => onSuccess("delete"),
      onError: (err) => onSuccess("delete", { error: err.message }),
    })

  const handleSubmit = (values: NewUserParams) => {
    if (editing) {
      // updateUser({ ...values, id: user.id, userId: user.id })
    } else {
      createUser(values)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        {/* <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button
          type='submit'
          className='mr-1'
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type='button'
            variant={"destructive"}
            onClick={() => deleteUser({ id: user.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  )
}

export default StudentForm
