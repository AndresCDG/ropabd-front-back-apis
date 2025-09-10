"use client"

import { useEffect, useState } from "react"
import { ProductCard, Product } from "@/components/common/product-card"
import { cn } from "@/lib/utils"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/productos")
        const data = await res.json()
        console.log("📦 Productos recibidos:", data)
        setProducts(data)
      } catch (error) {
        console.error("❌ Error al cargar productos:", error)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Catálogo de Productos
        </h1>
      </div>

      {products.length > 0 ? (
        <div
          className={cn(
            "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-gray-500">
            Intenta más tarde
          </p>
        </div>
      )}
    </div>
  )
}
