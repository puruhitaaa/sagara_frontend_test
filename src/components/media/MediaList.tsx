"use client";
import { CompleteMedia } from "@/lib/db/schema/media";
import { trpc } from "@/lib/trpc/client";
import MediaModal from "./MediaModal";


export default function MediaList({ media }: { media: CompleteMedia[] }) {
  const { data: m } = trpc.media.getMedia.useQuery(undefined, {
    initialData: { media },
    refetchOnMount: false,
  });

  if (m.media.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {m.media.map((media) => (
        <Media media={media} key={media.id} />
      ))}
    </ul>
  );
}

const Media = ({ media }: { media: CompleteMedia }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{media.type}</div>
      </div>
      <MediaModal media={media} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No media
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new media.
      </p>
      <div className="mt-6">
        <MediaModal emptyState={true} />
      </div>
    </div>
  );
};

