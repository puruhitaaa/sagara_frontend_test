import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import TrpcProvider from "@/lib/trpc/Provider"
import { cookies } from "next/headers"
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <TrpcProvider cookies={cookies().toString()}>
        <div className='flex h-screen overflow-hidden'>
          <Sidebar />
          <div className='w-full'>
            <Navbar />
            <div className='flex-1 md:p-8 pt-2 p-8 overflow-y-auto bg-brand-background h-full dark:bg-background'>
              {children}
            </div>
          </div>
        </div>
      </TrpcProvider>

      <Toaster richColors />
    </main>
  )
}
