import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // upsert asegura que si ya existe no de error, y si no existe la cree
  const defaultCategory = await prisma.Category.upsert({
    where: { id: 1 },
    update: {}, // No actualizamos nada si ya existe
    create: {
      name: 'Otros', // O el nombre que prefieras
    },
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });