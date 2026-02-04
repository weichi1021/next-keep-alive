import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { KeepAliveProvider } from "@/components/KeepAliveProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Home - Next Keep Alive",
  description: "Side Project Keep Alive",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Tw">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KeepAliveProvider>{children}</KeepAliveProvider>
      </body>
    </html>
  )
}
