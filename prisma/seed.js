import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Categoría por defecto
  const categories = [
    { name: 'Otros' },
    { name: 'Abarrotes' },
    { name: 'Lácteos' },
    { name: 'Higiene' }
  ];

  for (const category of categories) {
    await prisma.Category.createMany({
      data: [category],
      skipDuplicates: true
    }); 
    }

  // Productos
  const products = [
    {
      name: "Mayonesa 600gr",
      price: 17.80,
      categoryId: 2,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/mayonesa.jpg",
      units: 10
    },
    {
      name: "Leche Entera 1L",
      price: 24.50,
      categoryId: 3,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/leche.jpg",
      units: 10
    },
    {
      name: "Chikawa Figurita",
      price: 32.00,
      categoryId: 1,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/chikawaFigura.jpg",
      units: 10
    },
    {
      name: "Imagen De PlayStation5",
      price: 8900.00,
      categoryId: 1,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/impresionPlay5.jpg",
      units: 10
    },
    {
      name: "Yogurt de Fresa 1kg",
      price: 42.10,
      categoryId: 3,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/yogurthFresa.jpg",
      units: 10
    },
    {
      name: "Aceite Vegetal 900ml",
      price: 45.00,
      categoryId: 2,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/aceiteVegetal.jpg",
      units: 10
    },
    {
      name: "Espanta Mayates",
      price: 28.50,
      categoryId: 1,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/espantaMayates.jpg",
      units: 10
    },
    {
      name: "Pasta de Dientes 100ml",
      price: 35.00,
      categoryId: 4,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/pastaDeDientes.jpg",
      units: 10
    },
    {
      name: "Figura Travis Scott",
      price: 12.50,
      categoryId: 1,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/travisScott.jpg",
      units: 10
    },
    {
      name: "Leshe Shabo",
      price: 19.00,
      categoryId: 3,
      urlImg: "C:/Users/Theki/Desktop/6toSemestre/Redes de Computadoras/Unidad3/ProyectoTiendita/tiendaAPI/assets/images/lesheShabo.jpg",
      units: 10
    }
  ];


  await prisma.Products.createMany({
    data: products,
    skipDuplicates: true, 
  });

}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });