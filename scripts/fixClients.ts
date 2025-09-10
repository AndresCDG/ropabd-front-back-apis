// scripts/fixClientes.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usuariosSinCliente = await prisma.usuarios.findMany({
    where: {
      role: "cliente",
      cliente: null, // usuarios que aún no tienen cliente
    },
  });

  console.log(`🔍 Encontrados ${usuariosSinCliente.length} usuarios sin cliente`);

  for (const usuario of usuariosSinCliente) {
    await prisma.clientes.create({
      data: {
        usuario_id: usuario.id,
        address: "Pendiente",   // puedes poner valores por defecto
        phone: "Pendiente",
      },
    });
    console.log(`✅ Cliente creado para usuario_id=${usuario.id}`);
  }

  console.log("🎉 Todos los clientes faltantes fueron creados");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
