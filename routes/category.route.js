import { Router } from 'express';
// Controllers

// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import {createCategory, deleteCategory, updateCategory, getCategoryById, getCategories } from '../controllers/category.controller.js';
import { createCategorySchema, deleteCategorySchema, getCategoryByIdSchema, updateCategorySchema } from '../schemas/category.schema.js';
import { isValid } from 'zod/v3';

const router = Router();

// Category routes
router.post('/categories', validateSchema(createCategorySchema), createCategory);
router.get('/categories/:id', validateSchema(getCategoryByIdSchema), getCategoryById);
router.get('/categories', getCategories);
router.delete('/categories/:id', validateSchema(deleteCategorySchema), deleteCategory);
router.put('/categories/:id', validateSchema(updateCategorySchema), updateCategory);

export default router;