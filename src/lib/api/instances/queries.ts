import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type InstanceId, instanceIdSchema, instances } from "@/lib/db/schema/instances";

export const getInstances = async () => {
  const rows = await db.select().from(instances);
  const i = rows
  return { instances: i };
};

export const getInstanceById = async (id: InstanceId) => {
  const { id: instanceId } = instanceIdSchema.parse({ id });
  const [row] = await db.select().from(instances).where(eq(instances.id, instanceId));
  if (row === undefined) return {};
  const i = row;
  return { instance: i };
};


