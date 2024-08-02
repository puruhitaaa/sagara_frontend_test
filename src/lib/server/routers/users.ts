import { getUserById, getUsers } from "@/lib/api/users/queries"
import { adminProcedure, router } from "@/lib/server/trpc"
import {
  userIdSchema,
  insertUserParams,
  updateUserParams,
} from "@/lib/db/schema/auth"
import { createUser, deleteUser, updateUser } from "@/lib/api/users/mutations"

export const usersRouter = router({
  getUsers: adminProcedure.query(async () => {
    return getUsers()
  }),
  getUserById: adminProcedure.input(userIdSchema).query(async ({ input }) => {
    return getUserById({ id: input.id })
  }),
  createUser: adminProcedure
    .input(insertUserParams)
    .mutation(async ({ input }) => {
      return createUser(input)
    }),
  updateUser: adminProcedure
    .input(updateUserParams)
    .mutation(async ({ input }) => {
      return updateUser({ id: input.id }, input)
    }),
  deleteUser: adminProcedure.input(userIdSchema).mutation(async ({ input }) => {
    return deleteUser({ id: input.id })
  }),
})
