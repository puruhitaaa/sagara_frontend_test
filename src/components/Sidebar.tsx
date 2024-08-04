"use client"

import { cn } from "@/lib/utils"
import SidebarItems from "./SidebarItems"

import Image from "next/image"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { useNavbarStore } from "@/store/navbar"

type TSidebar = {
  isMobile?: boolean
}

const Sidebar = ({ isMobile = false }: TSidebar) => {
  const { toggleNavbar } = useNavbarStore()

  return (
    <aside
      className={cn(
        "h-screen min-w-[17.5rem] bg-brand-dark hidden md:block p-4 pt-[2.625rem] shadow",
        { "w-full fixed inset-0 block z-[99]": isMobile }
      )}
    >
      {isMobile ? (
        <Button
          className='absolute m-4 top-0 right-0'
          variant='secondary'
          size='icon'
          onClick={toggleNavbar}
        >
          <X className='h-5 w-5' />
        </Button>
      ) : null}
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
