"use client"

import SignOutBtn from "@/components/auth/SignOutBtn"
import { buttonVariants } from "@/components/ui/button"
import { useSession } from "@/providers/session"
import { MountainIcon } from "lucide-react"
import Link from "next/link"

function HomeNavbar() {
  const { session, user } = useSession()

  return (
    <header className='px-4 lg:px-6 h-14 flex items-center'>
      <Link className='flex items-center justify-center' href='#'>
        <MountainIcon className='h-6 w-6' />
        <span className='sr-only'>Acme Inc</span>
      </Link>
      <nav className='ml-auto flex items-center gap-4'>
        {user?.role === "admin" ? (
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href='/dashboard'
          >
            Dashboard
          </Link>
        ) : null}
        {!session ? (
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='/sign-in'
          >
            Sign In
          </Link>
        ) : (
          <SignOutBtn />
        )}
      </nav>
    </header>
  )
}

export default HomeNavbar
