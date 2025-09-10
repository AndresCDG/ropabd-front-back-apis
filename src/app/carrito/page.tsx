"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Trash2, Minus, Plus } from "lucide-react"

export default function CarritoPage() {
  const { cart, clearCart, addToCart, removeFromCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [productosActualizados, setProductosActualizados] = useState<any[]>([])

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0)

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error en el pedido")

      setMensaje(data.message)
      clearCart()
      setProductosActualizados(data.productos) // refresca catálogo
    } catch (err) {
      setMensaje("❌ Hubo un problema con el pedido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-6 sm:px-10">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.price.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}{" "}
                  x {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Botón disminuir */}
                <button
                  className="p-2 border rounded hover:bg-gray-100"
                  onClick={() =>
                    item.quantity > 1
                      ? addToCart({ ...item, quantity: -1 })
                      : removeFromCart(item.id)
                  }
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="px-2">{item.quantity}</span>

                {/* Botón aumentar */}
                <button
                  className="p-2 border rounded hover:bg-gray-100"
                  onClick={() => addToCart({ ...item, quantity: 1 })}
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Botón quitar */}
                <button
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between pt-4 font-bold text-lg">
            <span>Total:</span>
            <span>
              {total.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 disabled:bg-gray-400"
          >
            {loading ? "Procesando..." : "Finalizar Compra"}
          </button>
        </div>
      )}

      {mensaje && <p className="mt-4 font-medium">{mensaje}</p>}

      {productosActualizados.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Catálogo actualizado</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosActualizados.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow rounded-lg p-6 border"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p>
                  {Number(p.price).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </p>
                <p className="text-sm text-gray-500">Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
