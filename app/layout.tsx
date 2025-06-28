import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ServiTec - Soluciones tecnológicas a tu alcance",
  description:
    "Especialistas en reparación de computadoras, instalación Starlink, cámaras de seguridad y desarrollo web en Concepción del Uruguay, Entre Ríos.",
  keywords: "reparación computadoras, starlink, cámaras seguridad, desarrollo web, concepción del uruguay, entre ríos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <ScrollToTop />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
