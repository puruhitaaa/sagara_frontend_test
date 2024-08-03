import { getInstanceById, getInstances } from "@/lib/api/instances/queries"
import { adminProcedure, router } from "@/lib/server/trpc"
import {
  instanceIdSchema,
  insertInstanceParams,
  updateInstanceParams,
} from "@/lib/db/schema/instances"
import {
  createInstance,
  deleteInstance,
  updateInstance,
} from "@/lib/api/instances/mutations"

export const instancesRouter = router({
  getInstances: adminProcedure.query(async () => {
    return getInstances()
  }),
  getInstanceById: adminProcedure
    .input(instanceIdSchema)
    .query(async ({ input }) => {
      return getInstanceById(input.id)
    }),
  createInstance: adminProcedure
    .input(insertInstanceParams)
    .mutation(async ({ input }) => {
      return createInstance(input)
    }),
  updateInstance: adminProcedure
    .input(updateInstanceParams)
    .mutation(async ({ input }) => {
      return updateInstance(input.id, input)
    }),
  deleteInstance: adminProcedure
    .input(instanceIdSchema)
    .mutation(async ({ input }) => {
      return deleteInstance(input.id)
    }),
})
