"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context" // 🔹 importa tu cart
import { ShoppingCart } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart() // 🔹 aquí sacamos el carrito real

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <nav className="bg-cyan-700 text-white px-6 py-3 flex justify-between items-center">
      {/* 🔹 Logo con link */}
      <Link href="/productos" className="font-bold text-lg hover:text-cyan-300 transition">
        CLOTHESTYLE
      </Link>

      <div className="flex gap-6 items-center">
        {!user ? (
          <>
            <Link href="/">Inicio</Link>
            <Link href="/productos">Productos</Link>
            <Link href="/register">Registro</Link>
            <Link href="/login">Inicio de sesión</Link>
          </>
        ) : (
          <>
            <span className="font-semibold">
              Hola, {user.name?.split(" ")[0] || "Usuario"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-cyan-100 text-cyan-900 py-2 px-4 rounded hover:bg-cyan-200 transition"
            >
              Cerrar Sesión
            </button>
          </>
        )}

        {/* 🔹 Carrito */}
        <Link href="/carrito" className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
