"use client"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { Avatar, AvatarFallback } from "./ui/avatar"
import { useSession } from "@/providers/session"
import { getInitials } from "@/lib/utils"
import SignOutBtn from "./auth/SignOutBtn"
import Sidebar from "./Sidebar"
import { Menu } from "lucide-react"
import { useNavbarStore } from "@/store/navbar"

export default function Navbar() {
  const { user } = useSession()
  const { isOpen, toggleNavbar } = useNavbarStore()

  return (
    <div className='h-20 w-full px-5 md:px-10 flex items-center'>
      <Button
        onClick={toggleNavbar}
        variant='ghost'
        className='md:hidden'
        size='icon'
      >
        <Menu className='h-5 w-5' />
      </Button>
      <div className='w-fit ml-auto'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='inline-flex gap-[.938rem]'>
                <div className='flex flex-col items-end'>
                  <h5 className='font-semibold text-sm'>
                    {user?.name ?? "John Doe"}
                  </h5>
                  <p className='text-muted-foreground capitalize text-xs'>
                    {user?.role ?? "Admin"}
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
                <SignOutBtn />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {isOpen ? <Sidebar isMobile /> : null}
    </div>
  )
}
