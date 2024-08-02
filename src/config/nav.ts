import { SidebarLink } from "@/components/SidebarItems"
import { Building, GraduationCap, Image, LayoutGrid } from "lucide-react"

type DefaultLinks = {
  title: string
  links: SidebarLink[]
}

export const defaultLinks: DefaultLinks[] = [
  {
    title: "Menu",
    links: [
      { href: "/dashboard", title: "Dashboard", icon: LayoutGrid },
      {
        href: "/instances",
        title: "Instances",
        icon: Building,
      },
      {
        href: "/media",
        title: "Media",
        icon: Image,
      },
      {
        href: "/students",
        title: "Students",
        icon: GraduationCap,
      },
    ],
  },
]
