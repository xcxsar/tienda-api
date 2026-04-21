import { url } from 'zod';
import { createProductSchema, deleteProductSchema, getProductByIdSchema, updateProductSchema, getProductsByCategoryIdSchema } from '../schemas/products.schema.js';
import { prismaClient } from '../utils/db.js';
import bcrypt from 'bcryptjs';

export const createProduct = async (req, res) => {
    const result = createProductSchema.parse(req.body);
    const { id, name, price, units, categoryId, urlImg } = result;
     try {
            // 1. Find name (Prisma uses findUnique for @unique fields)
            const productFound = await prismaClient.Products.findFirst({
                where: { name }
            });
            const categoryFound = await prismaClient.Category.findFirst({
                where: { id: categoryId }
            });
            
            if (productFound) return res.status(400).json(["El nombre del producto ya esta en uso."]);
            if (!categoryFound) return res.status(404).json(["La categoria no fue encontrada."]);
            
            // 2. Create product
            const productSaved = await prismaClient.Products.create({
                data: {
                    name,
                    price,
                    units : 0,
                    categoryId,
                    urlImg
                }
            });

            res.json({
                id: productSaved.id,
                name: productSaved.name,
                price: productSaved.price,
                units : 0,
                categoryId: productSaved.categoryId,
                urlImg: productSaved.urlImg
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al registrar el producto' });
        }
}

export const deleteProduct = async (req, res) =>{
     const result = deleteProductSchema.parse(req.body);
     const { id } = result;
     try {
            // 1. Find id (Prisma uses findUnique for @unique fields)
            const productFound = await prismaClient.Products.findUnique({
                where: { id }
            });
            
            if (!productFound) return res.status(404).json(["El producto no fue encontrado."]);
    
            // 2. Delete product
            const productDeleted = await prismaClient.Products.delete({
                where: { id }
            });
            
            res.json({
                id: productDeleted.id,
                name: productDeleted.name,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al eliminar el producto' });
        }
}

export const updateProduct = async (req, res) => {
  const result = updateProductSchema.parse(req.body);
  const { id, name, price, units, categoryId, urlImg } = result;

  try {
    const productFound = await prismaClient.Products.findUnique({
      where: { id }
    });

    if (!productFound) {
      return res.status(404).json(["El producto no fue encontrado."]);
    }

    if (categoryId !== undefined) {
      const categoryFound = await prismaClient.Category.findUnique({
        where: { id: categoryId }
      });

      if (!categoryFound) {
        return res.status(404).json(["La categoria no fue encontrada."]);
      }
    }

    const dataToUpdate = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (price !== undefined) dataToUpdate.price = price;
    if (units !== undefined) dataToUpdate.units = units;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (urlImg !== undefined) dataToUpdate.urlImg = urlImg;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        message: "Debes enviar al menos un campo para actualizar"
      });
    }

    const productUpdated = await prismaClient.Products.update({
      where: { id },
      data: dataToUpdate
    });

    res.json(productUpdated);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

export const getProducts = async (req, res) =>{ 
    try {
            // 1. Find id (Prisma uses findMany for all records)
            const products = await prismaClient.Products.findMany();

            if (products.length === 0) return res.status(404).json(["No hay productos."]);
            
            res.json(
                products
            );

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
}

export const getProductById = async (req, res) =>{
    const result = getProductByIdSchema.parse(req.body);
    const { id, name} = result;
     try {
            // 1. Find id (Prisma uses findUnique for @unique fields)
            const productFound = await prismaClient.Products.findFirst({
                where: { 
                    OR: [
                        { id },
                        { name }
                    ]
                }
            });
            
            if (!productFound) return res.status(404).json(["El producto no fue encontrado."]);
            
            res.json({
                id: productFound.id,
                name: productFound.name,
                price: productFound.price,
                units: productFound.units,
                categoryId: productFound.categoryId,
                urlImg: productFound.urlImg
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al obtener el producto' });
        }
}

export const verifyProductUnits = async (req, res) => {
   const { id,sellQuantity } = req.body;
    try {
        const productFound = await prismaClient.Products.findUnique({
            where: { id: productId }
        });
        if (!productFound) return res.status(404).json(["El producto no fue encontrado."]);
        
        if (productFound.units < sellQuantity) return res.status(401).json(["No hay suficientes unidades del producto."]);
        
        res.json({})
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al verificar las unidades del producto' });
    }
}

export const getProductsByCategoryId = async (req, res) =>{
    const result = getProductsByCategoryIdSchema.parse(req.body);
    const { categoryId } = result;
     try {
            // 1. Find id (Prisma uses findUnique for @unique fields)
            const products = await prismaClient.Products.findMany({
                where: { 
                    categoryId
                }
            });
            
            if (!products) return res.status(404).json(["No hay productos ."]);
            
            res.json({
            products});

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al obtener productos' });
        }
}