// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, address, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Crear usuario (y cliente si aplica)
    const usuario = await prisma.usuarios.create({
      data: {
        name,
        email,
        password,
        role: role ?? "cliente",
        cliente:
          role === "cliente"
            ? {
                create: {
                  address: address ?? "Sin dirección",
                  phone: phone ?? "Sin teléfono",
                },
              }
            : undefined,
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json({
      message: "✅ Usuario registrado correctamente",
      user: usuario,
    });
  } catch (error: any) {
    console.error("❌ Error en POST /api/usuarios:", error);
    return NextResponse.json(
      { error: error.message || "Error inesperado" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const usuarios = await prisma.usuarios.findMany({
      include: { cliente: true },
    });
    return NextResponse.json(usuarios);
  } catch (error: any) {
    console.error("❌ Error en GET /api/usuarios:", error);
    return NextResponse.json(
      { error: error.message || "Error inesperado" },
      { status: 500 }
    );
  }
}
