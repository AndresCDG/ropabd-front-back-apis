// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, address, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Crear usuario (y cliente si el rol es cliente)
    const usuario = await prisma.usuarios.create({
      data: {
        name,
        email,
        password, // ⚠️ pendiente de hashear con bcrypt
        role: role ?? "cliente",
        ...(role === "cliente" || !role
          ? {
              clientes: {
                create: {
                  address: address || "sin dirección",
                  phone: phone || "000000000",
                },
              },
            }
          : {}),
      },
      include: {
        clientes: true, // para ver la info del cliente creado
      },
    });

    return NextResponse.json({
      message: "Usuario registrado ✅",
      user: usuario,
    });
  } catch (error) {
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
      include: { clientes: true },
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("❌ Error en GET /api/usuarios:", error);
    return NextResponse.json(
      { error: error.message || "Error inesperado" },
      { status: 500 }
    );
  }
}
