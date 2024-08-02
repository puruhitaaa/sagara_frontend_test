"use client";
import { CompleteInstance } from "@/lib/db/schema/instances";
import { trpc } from "@/lib/trpc/client";
import InstanceModal from "./InstanceModal";


export default function InstanceList({ instances }: { instances: CompleteInstance[] }) {
  const { data: i } = trpc.instances.getInstances.useQuery(undefined, {
    initialData: { instances },
    refetchOnMount: false,
  });

  if (i.instances.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {i.instances.map((instance) => (
        <Instance instance={instance} key={instance.id} />
      ))}
    </ul>
  );
}

const Instance = ({ instance }: { instance: CompleteInstance }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{instance.name}</div>
      </div>
      <InstanceModal instance={instance} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No instances
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new instance.
      </p>
      <div className="mt-6">
        <InstanceModal emptyState={true} />
      </div>
    </div>
  );
};

