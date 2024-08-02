import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SessionProvider } from "@/providers/session"
import { validateRequest } from "@/lib/auth/lucia"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sagara FE",
  description: "A dashboard app for FE rec purposes.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessionData = await validateRequest()

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider value={sessionData}>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
