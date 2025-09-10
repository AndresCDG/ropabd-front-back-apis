"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"  // 👈 importamos el contexto

export interface Product {
  id: number
  name: string
  description: string
  price: string | number
  stock: number
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth() // 👈 obtenemos el usuario

  const handleAddToCart = async () => {
    if (!user) {
      // 👈 si no hay usuario, redirige a login
      window.location.href = "/login"
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
    })

    setIsLoading(false)
  }

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

        <span
          className={cn(
            "inline-block px-2 py-1 text-xs rounded",
            product.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          )}
        >
          {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
        </span>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between">
        <span className="text-lg font-bold text-primary">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(Number(product.price))}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isLoading}
          className={cn(
            "flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-md min-w-[100px] transition",
            product.stock <= 0 || isLoading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Agregar
            </>
          )}
        </button>
      </div>
    </div>
  )
}
