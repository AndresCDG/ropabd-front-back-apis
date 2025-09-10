export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, items } = body

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    // 🔹 buscamos al cliente vinculado al usuario
    const cliente = await prisma.clientes.findFirst({
      where: { usuario_id: userId },
    })

    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // 🔹 creamos el pedido con sus detalles (sin tocar el stock)
    const pedido = await prisma.pedidos.create({
      data: {
        cliente_id: cliente.id,
        total: items.reduce((acc: number, i: any) => acc + i.price * i.quantity, 0),
        status: "pending",
        detalles_pedido: {
          create: items.map((i: any) => ({
            producto_id: i.id,
            cantidad: i.quantity,
            subtotal: i.price * i.quantity,
          })),
        },
      },
      include: { detalles_pedido: true },
    })

    // 🔹 confirmamos el pedido y que Postgres actualice el stock
    await prisma.$executeRawUnsafe(`CALL confirmar_pedido(${pedido.id})`)

    return NextResponse.json({ message: "Pedido confirmado ✅", pedido })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}
