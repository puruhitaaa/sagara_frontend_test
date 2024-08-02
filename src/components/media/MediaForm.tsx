"use client"

import { Media, NewMediaParams, insertMediaParams } from "@/lib/db/schema/media"
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

const MediaForm = ({
  media,
  closeModal,
}: {
  media?: Media
  closeModal?: () => void
}) => {
  const editing = !!media?.id

  const router = useRouter()
  const utils = trpc.useUtils()

  const form = useForm<z.infer<typeof insertMediaParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertMediaParams),
    defaultValues: media ?? {
      type: "",
      url: "",
      description: "",
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

    await utils.media.getMedia.invalidate()
    router.refresh()
    if (closeModal) closeModal()
    toast.success(`Media ${action}d!`)
  }

  const { mutate: createMedia, isLoading: isCreating } =
    trpc.media.createMedia.useMutation({
      onSuccess: (res) => onSuccess("create"),
      onError: (err) => onSuccess("create", { error: err.message }),
    })

  const { mutate: updateMedia, isLoading: isUpdating } =
    trpc.media.updateMedia.useMutation({
      onSuccess: (res) => onSuccess("update"),
      onError: (err) => onSuccess("update", { error: err.message }),
    })

  const { mutate: deleteMedia, isLoading: isDeleting } =
    trpc.media.deleteMedia.useMutation({
      onSuccess: (res) => onSuccess("delete"),
      onError: (err) => onSuccess("delete", { error: err.message }),
    })

  const handleSubmit = (values: NewMediaParams) => {
    if (editing) {
      updateMedia({ ...values, id: media.id, userId: media.userId })
    } else {
      createMedia(values)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
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
        />
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
            onClick={() => deleteMedia({ id: media.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  )
}

export default MediaForm
