export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // Busca usuario
    const usuario = await prisma.usuarios.findUnique({ where: { email } })

    if (!usuario || usuario.password !== password) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: "Inicio de sesión exitoso ✅",
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
