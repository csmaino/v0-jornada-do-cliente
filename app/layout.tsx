import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AdminProvider } from "./contexts/admin-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MeuSite - Soluções Digitais Inovadoras",
  description:
    "Transformamos ideias em soluções digitais inovadoras. Desenvolvimento web responsivo e design personalizado.",
  keywords: "desenvolvimento web, design responsivo, soluções digitais, websites, aplicações web",
  authors: [{ name: "MeuSite" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  )
}
