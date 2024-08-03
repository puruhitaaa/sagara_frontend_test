import {
  getUserById,
  getUserCountByRoleUser,
  getUsers,
} from "@/lib/api/users/queries"
import { publicProcedure, router } from "@/lib/server/trpc"
import {
  userIdSchema,
  insertUserParams,
  updateUserParams,
  newUserSchema,
  newUpdateUserSchema,
} from "@/lib/db/schema/auth"
import { createUser, deleteUser, updateUser } from "@/lib/api/users/mutations"
import { z } from "zod"
import { TRPCError } from "@trpc/server"

export const getUsersSchema = z.object({
  page: z.number().min(1).catch(1).nullish(),
  limit: z.number().min(1).max(6).catch(6).nullish(),
  activeColumns: z.array(z.string()).optional(),
  // searchParams: z
  //   .object({
  //     name: z.string().nullish(),
  //     email: z.string().nullish(),
  //     phoneNumber: z.string().nullish(),
  //     instance: z.string().nullish(),
  //     createdAt: z.string().nullish(),
  //   })
  //   .nullish(),
})

export const usersRouter = router({
  getUsers: publicProcedure.input(getUsersSchema).query(async ({ input }) => {
    return getUsers(input)
  }),
  getUserById: publicProcedure.input(userIdSchema).query(async ({ input }) => {
    return getUserById({ id: input.id })
  }),
  createUser: publicProcedure
    .input(newUserSchema)
    .mutation(async ({ input }) => {
      if (input.password !== input.confirmationPassword) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
      return createUser(input)
    }),
  updateUser: publicProcedure
    .input(newUpdateUserSchema)
    .mutation(async ({ input }) => {
      return updateUser(input)
    }),
  deleteUser: publicProcedure
    .input(userIdSchema)
    .mutation(async ({ input }) => {
      return deleteUser(input.id)
    }),
  getUserCountByRoleUser: publicProcedure.query(async () => {
    return getUserCountByRoleUser()
  }),
})
