export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import prisma from "@/lib/prisma"

export async function GET() {
  const productos = await prisma.productos.findMany()
  return Response.json(productos)
}

