"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import { defaultLinks } from "@/config/nav"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useSession } from "@/providers/session"
import { getInitials } from "@/lib/utils"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useSession()

  return (
    <div className='h-20 w-full bg-white px-5 md:px-10 flex items-center'>
      <div className='w-fit ml-auto'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='bg-white inline-flex gap-[.938rem]'>
                <div className='flex flex-col items-end'>
                  <h5 className='font-semibold text-sm'>{user?.name}</h5>
                  <p className='text-muted-foreground capitalize text-xs'>
                    {user?.role}
                  </p>
                </div>
                <Avatar>
                  {/* <AvatarImage src={user?.media.url} /> */}
                  <AvatarFallback>
                    {user?.name ? getInitials(user?.name) : "John Doe"}
                  </AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* {open ? (
        <div className='my-4 p-4 bg-muted'>
          <ul className='space-y-2'>
            {additionalLinks.map((link) => (
              <li key={link.title} onClick={() => setOpen(false)} className=''>
                <Link
                  href={link.href}
                  className={
                    pathname === link.href
                      ? "text-primary hover:text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null} */}
    </div>
  )
}
