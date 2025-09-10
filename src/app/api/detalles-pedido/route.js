export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import prisma from "@/lib/prisma"

//carrito de compras
// Agregar producto
export async function POST(req) {
  const { pedido_id, producto_id, cantidad } = await req.json()

  const producto = await prisma.productos.findUnique({ where: { id: producto_id } })
  const subtotal = producto.price * cantidad

  const detalle = await prisma.detalles_pedido.create({
    data: { pedido_id, producto_id, cantidad, subtotal }
  })

  await prisma.pedidos.update({
    where: { id: pedido_id },
    data: { total: { increment: subtotal } }
  })

  return Response.json(detalle)
}

// Quitar producto
export async function DELETE(req) {
  const { pedido_id, producto_id } = await req.json()

  const detalle = await prisma.detalles_pedido.findFirst({
    where: { pedido_id, producto_id }
  })

  if (!detalle) return Response.json({ error: "No existe el producto en el pedido" }, { status: 400 })

  await prisma.detalles_pedido.delete({ where: { id: detalle.id } })

  await prisma.pedidos.update({
    where: { id: pedido_id },
    data: { total: { decrement: detalle.subtotal } }
  })

  return Response.json({ message: "Producto eliminado del carrito" })
}
