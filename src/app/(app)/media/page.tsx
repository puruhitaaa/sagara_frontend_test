import MediaList from "@/components/media/MediaList"
import NewMediaModal from "@/components/media/MediaModal"
import { api } from "@/lib/trpc/api"

export default async function Media() {
  const { media } = await api.media.getMedia.query()

  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='font-semibold text-2xl my-2'>Media</h1>
        <NewMediaModal />
      </div>
      <MediaList media={media} />
    </div>
  )
}
