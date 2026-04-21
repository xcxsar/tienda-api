import { Router } from 'express';
// Controllers
import {createProduct,deleteProduct,updateProduct, getProductById,getProducts,getProductsByCategoryId } from '../controllers/products.controller.js';
// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import {createProductSchema,updateProductSchema,getProductByIdSchema,deleteProductSchema,getProductsByCategoryIdSchema } from '../schemas/products.schema.js';
import { isValid } from 'zod/v3';

const router = Router();

// Product routes
router.post('/products', validateSchema(createProductSchema), createProduct);
router.get('/products/:id', validateSchema(getProductByIdSchema), getProductById);
router.get('/products', getProducts);
router.delete('/products/:id', validateSchema(deleteProductSchema), deleteProduct);
router.put('/products/:id', validateSchema(updateProductSchema), updateProduct);
router.get('/products/:categoryId', validateSchema(getProductsByCategoryIdSchema), getProductsByCategoryId);
export default router;