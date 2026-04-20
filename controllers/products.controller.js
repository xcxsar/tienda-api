import { prismaClient } from '../utils/db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.sign.js';
import jwt from 'jsonwebtoken';

export const insertProduct = async (req, res) => {
    const { name, price } = req.body;
     try {
            // 1. Find name (Prisma uses findUnique for @unique fields)
            const productFound = await prismaClient.products.findFirst({
                where: { name }
            });
            
            if (productFound) return res.status(400).json(["El nombre del producto ya esta en uso."]);
    
            // 2. Create product
            const productSaved = await prismaClient.products.create({
                data: {
                    name,
                    price,
                    units : 0
                }
            });

            res.json({
                id: productSaved.id,
                name: productSaved.name,
                price: productSaved.price,
                units : 0
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al registrar el producto' });
        }
}

export const deleteProduct = async (req, res) =>{
     const { id } = req.body;
     try {
            // 1. Find id (Prisma uses findUnique for @unique fields)
            const productFound = await prismaClient.products.findUnique({
                where: { id }
            });
            
            if (!productFound) return res.status(404).json(["El producto no fue encontrado."]);
    
            // 2. Delete product
            const productDeleted = await prismaClient.products.delete({
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

export const updateProduct = async (req, res) =>{
     const {  id,name, price,units } = req.body;
     try {
            // 1. Find id (Prisma uses findUnique for @unique fields)
            const productFound = await prismaClient.products.findUnique({
                where: { id }
            });
            
            if (!productFound) return res.status(404).json(["El producto no fue encontrado."]);
    
            // 2. Update product
            const productUpdated = await prismaClient.products.update({
                where: { id },
                data: {
                    name,
                    price,
                    units
                }
            });
            
            res.json({
                id: productUpdated.id,
                name: productUpdated.name,
                price: productUpdated.price,
                units: productUpdated.units
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al actualizar el producto' });
        }
}

export const listProduct = async (req, res) =>{ 
    try {
            // 1. Find id (Prisma uses findMany for all records)
            const products = await prismaClient.products.findMany();

            if (products.length === 0) return res.status(404).json(["No hay productos."]);
            
            res.json(
                products
            );

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
}

export const getProduct = async (req, res) =>{
     const { id,name } = req.body;
     try {
            // 1. Find id (Prisma uses findUnique for @unique fields)
            const productFound = await prismaClient.products.findFirst({
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
                units: productFound.units
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al obtener el producto' });
        }
}

