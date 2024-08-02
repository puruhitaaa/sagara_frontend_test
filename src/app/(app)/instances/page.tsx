import InstanceList from "@/components/instances/InstanceList"
import NewInstanceModal from "@/components/instances/InstanceModal"
import { api } from "@/lib/trpc/api"

export default async function Instances() {
  const { instances } = await api.instances.getInstances.query()

  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='font-semibold text-2xl my-2'>Instances</h1>
        <NewInstanceModal />
      </div>
      <InstanceList instances={instances} />
    </div>
  )
}
