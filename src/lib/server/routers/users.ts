import {
  getUserById,
  getUserCountByRoleUser,
  getUsers,
} from "@/lib/api/users/queries"
import { adminProcedure, router } from "@/lib/server/trpc"
import {
  userIdSchema,
  insertUserParams,
  updateUserParams,
  newUserSchema,
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
  getUsers: adminProcedure.input(getUsersSchema).query(async ({ input }) => {
    return getUsers(input)
  }),
  getUserById: adminProcedure.input(userIdSchema).query(async ({ input }) => {
    return getUserById({ id: input.id })
  }),
  createUser: adminProcedure
    .input(newUserSchema)
    .mutation(async ({ input }) => {
      if (input.password !== input.confirmationPassword) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
      return createUser(input)
    }),
  updateUser: adminProcedure
    .input(updateUserParams)
    .mutation(async ({ input }) => {
      return updateUser({ id: input.id }, input)
    }),
  deleteUser: adminProcedure.input(userIdSchema).mutation(async ({ input }) => {
    return deleteUser(input.id)
  }),
  getUserCountByRoleUser: adminProcedure.query(async () => {
    return getUserCountByRoleUser()
  }),
})
