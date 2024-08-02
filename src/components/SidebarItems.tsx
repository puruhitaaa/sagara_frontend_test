"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { defaultLinks } from "@/config/nav"

export interface SidebarLink {
  title: string
  href: string
  icon: LucideIcon
}

const SidebarItems = () => {
  return (
    <>
      {defaultLinks.length > 0
        ? defaultLinks.map((l) => (
            <SidebarLinkGroup
              links={l.links}
              title={l.title}
              border
              key={l.title}
            />
          ))
        : null}
    </>
  )
}
export default SidebarItems

const SidebarLinkGroup = ({
  links,
  title,
  border,
}: {
  links: SidebarLink[]
  title?: string
  border?: boolean
}) => {
  const fullPathname = usePathname()
  const pathname = "/" + fullPathname.split("/")[1]

  return (
    <div className={border ? "my-8 pt-4" : ""}>
      {title ? (
        <h4 className='px-2 mb-2 text-sm uppercase text-muted-foreground tracking-wider'>
          {title}
        </h4>
      ) : null}
      <ul className='space-y-2'>
        {links.map((link) => (
          <li key={link.title}>
            <SidebarLink link={link} active={pathname === link.href} />
          </li>
        ))}
      </ul>
    </div>
  )
}
const SidebarLink = ({
  link,
  active,
}: {
  link: SidebarLink
  active: boolean
}) => {
  return (
    <Link
      href={link.href}
      className={`group transition-colors py-2 px-3 inline-block hover:bg-popover hover:text-primary text-muted-foreground text-sm hover:shadow rounded w-full${
        active ? " text-white font-semibold bg-brand-red" : ""
      }`}
    >
      <div className='flex items-center gap-1'>
        <div
          className={cn(
            "opacity-0 left-0 h-6 w-[4px] absolute rounded-r-lg bg-primary",
            active ? "opacity-100" : ""
          )}
        />
        <link.icon className='h-[1.125rem] mr-1' />
        <span>{link.title}</span>
      </div>
    </Link>
  )
}
