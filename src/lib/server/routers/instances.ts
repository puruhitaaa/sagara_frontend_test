import { getInstanceById, getInstances } from "@/lib/api/instances/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  instanceIdSchema,
  insertInstanceParams,
  updateInstanceParams,
} from "@/lib/db/schema/instances";
import { createInstance, deleteInstance, updateInstance } from "@/lib/api/instances/mutations";

export const instancesRouter = router({
  getInstances: publicProcedure.query(async () => {
    return getInstances();
  }),
  getInstanceById: publicProcedure.input(instanceIdSchema).query(async ({ input }) => {
    return getInstanceById(input.id);
  }),
  createInstance: publicProcedure
    .input(insertInstanceParams)
    .mutation(async ({ input }) => {
      return createInstance(input);
    }),
  updateInstance: publicProcedure
    .input(updateInstanceParams)
    .mutation(async ({ input }) => {
      return updateInstance(input.id, input);
    }),
  deleteInstance: publicProcedure
    .input(instanceIdSchema)
    .mutation(async ({ input }) => {
      return deleteInstance(input.id);
    }),
});
