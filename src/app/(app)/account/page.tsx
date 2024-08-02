import UserSettings from "./UserSettings"

export default async function Account() {
  return (
    <div>
      <h1 className='text-2xl font-semibold my-4'>Account</h1>
      <div className='space-y-4'>
        <UserSettings />
      </div>
    </div>
  )
}
