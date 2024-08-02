import { getUserAuth } from "@/lib/auth/utils"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getUserAuth()
  if (session?.session) {
    if (session.session.user.role === "admin") {
      redirect("/dashboard")
    } else if (session.session.user.role === "user") {
      redirect("/")
    }
  }

  return <div className='bg-muted h-screen pt-8'>{children}</div>
}
