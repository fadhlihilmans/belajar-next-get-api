import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MainLayout from "@/components/layouts/MainLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aplikasi Next.js",
  description: "Dashboard menggunakan Next.js App Router",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}