import SidebarItems from "./SidebarItems"

import { getUserAuth } from "@/lib/auth/utils"
import Image from "next/image"

const Sidebar = async () => {
  const session = await getUserAuth()
  if (session.session === null) return null

  return (
    <aside className='h-screen min-w-[17.5rem] bg-brand-dark hidden md:block p-4 pt-[2.625rem] shadow'>
      <div className='flex flex-col justify-between h-full'>
        <div className='space-y-[3.125rem]'>
          <Image
            alt='sagara-tech'
            className='w-fit h-16'
            src='/logo.png'
            style={{
              objectFit: "contain",
            }}
            priority
            width={500}
            height={500}
          />
          <SidebarItems />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
