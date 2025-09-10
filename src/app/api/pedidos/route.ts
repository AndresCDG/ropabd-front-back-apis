export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();

    console.log("👉 Body recibido en /api/pedidos:", { userId, items });

    // Validación inicial
    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "❌ Body inválido. Debe incluir { userId, items[] }" },
        { status: 400 }
      );
    }

    // 1. Buscar cliente relacionado al usuario
    const cliente = await prisma.clientes.findFirst({
      where: { usuario_id: userId },
    });

    if (!cliente) {
      console.warn(`⚠️ Cliente no encontrado para usuario_id=${userId}`);
      return NextResponse.json(
        { error: `Cliente no encontrado para usuario_id=${userId}` },
        { status: 400 }
      );
    }

    // 2. Crear pedido vacío
    const pedido = await prisma.pedidos.create({
      data: {
        cliente_id: cliente.id,
        total: 0,
        status: "pending",
      },
    });

    let total = 0;

    // 3. Insertar detalles
    for (const item of items) {
      console.log("🔎 Procesando item:", item);

      if (!item.id || !item.quantity) {
        return NextResponse.json(
          { error: `Item inválido: ${JSON.stringify(item)}` },
          { status: 400 }
        );
      }

      const producto = await prisma.productos.findUnique({
        where: { id: item.id },
      });

      if (!producto) {
        return NextResponse.json(
          { error: `Producto con id=${item.id} no existe` },
          { status: 400 }
        );
      }

      if (producto.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para producto ${producto.name}. Stock=${producto.stock}, solicitado=${item.quantity}`,
          },
          { status: 400 }
        );
      }

      const precio = Number(producto.price);
      const subtotal = precio * item.quantity;
      total += subtotal;

      await prisma.detalles_pedido.create({
        data: {
          pedido_id: pedido.id,
          producto_id: producto.id,
          cantidad: item.quantity,
          subtotal,
        },
      });

      await prisma.productos.update({
        where: { id: producto.id },
        data: { stock: producto.stock - item.quantity },
      });
    }

    // 4. Actualizar total
    await prisma.pedidos.update({
      where: { id: pedido.id },
      data: { total, status: "confirmed" },
    });

    const productos = await prisma.productos.findMany();

    return NextResponse.json({
      message: "✅ Pedido realizado con éxito",
      pedidoId: pedido.id,
      total,
      productos,
    });
  } catch (err: any) {
    console.error("❌ Error en /api/pedidos:", err);
    return NextResponse.json(
      { error: err.message || "Error procesando el pedido" },
      { status: 500 }
    );
  }
}
