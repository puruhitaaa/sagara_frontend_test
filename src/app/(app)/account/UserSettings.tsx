"use client"

import UpdateNameCard from "./UpdateNameCard"
import UpdateEmailCard from "./UpdateEmailCard"
import { useSession } from "@/providers/session"

export default function UserSettings() {
  const { user } = useSession()

  return (
    <>
      <UpdateNameCard name={user?.name ?? ""} />
      <UpdateEmailCard email={user?.email ?? ""} />
    </>
  )
}
