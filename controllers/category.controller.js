import { prismaClient } from '../utils/db.js';
import { createCategorySchema, deleteCategorySchema, updateCategorySchema,getCategoryByIdSchema } from '../schemas/category.schema.js';
import bcrypt from 'bcryptjs';

export const createCategory = async (req, res) => {
        const result = createCategorySchema.parse(req.body);
        const { name } = result;
        try {
            // 1. Find name (Prisma uses findUnique for @unique fields)
            const categoryFound = await prismaClient.Category.findFirst({
                where: { name }
            });
            if(categoryFound) return res.status(400).json(["El nombre de la categoria ya esta en uso."])
            
            // 2. Create category
            const categorySaved = await prismaClient.Category.create({
                data: {
                    name
                }
            });

            res.json({
                id: categorySaved.id,
                name: categorySaved.name
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al registrar la categoria' });
        }
}

export const deleteCategory = async (req, res) => {
        const result = deleteCategorySchema.parse(req.body);
        const { id } = result;
        try {
            // 1. Find category by ID
            const categoryFound = await prismaClient.Category.findUnique({
                where: { id }
            });
            if(!categoryFound) return res.status(404).json(["La categoria no fue encontrada."])

            // 2. Delete category
            const categoryDeleted = await prismaClient.Category.delete({
                where: { id }
            });

            res.json({
                id: categoryDeleted.id,
                name: categoryDeleted.name
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al eliminar la categoria' });
        }
}

export const updateCategory = async (req, res) => {
        const result = updateCategorySchema.parse(req.body);
        const { id, name } = result;
        try {
            // 1. Find category by ID
            const categoryFound = await prismaClient.Category.findUnique({
                where: { id }
            });
            if(!categoryFound) return res.status(404).json(["La categoria no fue encontrada."])

            // 2. Update category
            const categoryUpdated = await prismaClient.Category.update({
                where: { id },
                data: { name }
            });

            res.json({
                id: categoryUpdated.id,
                name: categoryUpdated.name
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al actualizar la categoria' });
        }
}

export const getCategories = async (req,res) => {
        try {
            const categories = await prismaClient.Category.findMany();
            
            if(categories.length === 0) return res.status(404).json({ message: 'No se encontraron categorias' });

            res.json(categories);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al obtener las categorias' });
        }
}

export const getCategoryById = async (req, res) => {
        const result = getCategoryByIdSchema.parse(req.body);
        const { id, name } = result;
        try {
            // 1. Find category by ID
            const categoryFound = await prismaClient.Category.findFirst({
                where: { 
                    OR:[
                        {id},
                        {name}
                    ]
                }
            });
            if(!categoryFound) return res.status(404).json(["La categoria no fue encontrada."])

            res.json({
                id: categoryFound.id,
                name: categoryFound.name
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al encontrar la categoria' });
        }
}
