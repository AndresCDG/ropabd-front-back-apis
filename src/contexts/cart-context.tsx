"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [initialized, setInitialized] = useState(false)

  // cargar carrito desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart")
      if (stored && stored !== "undefined" && stored !== "null") {
        setCart(JSON.parse(stored))
      }
    } catch (error) {
      console.error("❌ Error cargando carrito:", error)
      localStorage.removeItem("cart")
    } finally {
      setInitialized(true)
    }
  }, [])

  // guardar carrito en localStorage
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, initialized])

  const addToCart = (item: CartItem) => {
    console.log("🛒 addToCart ejecutado con:", item)

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const clearCart = () => setCart([])

  if (!initialized) {
    return null // 🔹 evita duplicación inicial
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
  return context
}
