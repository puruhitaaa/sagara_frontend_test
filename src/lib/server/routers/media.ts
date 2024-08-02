import { getMediaById, getMedia } from "@/lib/api/media/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  mediaIdSchema,
  insertMediaParams,
  updateMediaParams,
} from "@/lib/db/schema/media";
import { createMedia, deleteMedia, updateMedia } from "@/lib/api/media/mutations";

export const mediaRouter = router({
  getMedia: publicProcedure.query(async () => {
    return getMedia();
  }),
  getMediaById: publicProcedure.input(mediaIdSchema).query(async ({ input }) => {
    return getMediaById(input.id);
  }),
  createMedia: publicProcedure
    .input(insertMediaParams)
    .mutation(async ({ input }) => {
      return createMedia(input);
    }),
  updateMedia: publicProcedure
    .input(updateMediaParams)
    .mutation(async ({ input }) => {
      return updateMedia(input.id, input);
    }),
  deleteMedia: publicProcedure
    .input(mediaIdSchema)
    .mutation(async ({ input }) => {
      return deleteMedia(input.id);
    }),
});
