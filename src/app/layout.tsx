import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import Navbar from "@/components/common/navbar"

export const metadata: Metadata = {
  title: "CLOTHESTYLE - Tienda Online",
  description: "Compra ropa fácil y rápido",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <footer className="bg-gray-100 text-center py-4 text-sm text-muted-foreground">
              © {new Date().getFullYear()} CLOTHESTYLE. Todos los derechos reservados.
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
