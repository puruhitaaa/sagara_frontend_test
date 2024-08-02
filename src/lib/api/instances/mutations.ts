import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  InstanceId, 
  NewInstanceParams,
  UpdateInstanceParams, 
  updateInstanceSchema,
  insertInstanceSchema, 
  instances,
  instanceIdSchema 
} from "@/lib/db/schema/instances";

export const createInstance = async (instance: NewInstanceParams) => {
  const newInstance = insertInstanceSchema.parse(instance);
  try {
    const [i] =  await db.insert(instances).values(newInstance).returning();
    return { instance: i };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateInstance = async (id: InstanceId, instance: UpdateInstanceParams) => {
  const { id: instanceId } = instanceIdSchema.parse({ id });
  const newInstance = updateInstanceSchema.parse(instance);
  try {
    const [i] =  await db
     .update(instances)
     .set({...newInstance, updatedAt: new Date() })
     .where(eq(instances.id, instanceId!))
     .returning();
    return { instance: i };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteInstance = async (id: InstanceId) => {
  const { id: instanceId } = instanceIdSchema.parse({ id });
  try {
    const [i] =  await db.delete(instances).where(eq(instances.id, instanceId!))
    .returning();
    return { instance: i };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

