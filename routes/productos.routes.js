import { Router } from 'express';
// Controllers
import {insertProduct,deleteProduct,updateProduct, getProduct,listProduct } from '../controllers/products.controller.js';
// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import { insertProductSchema,updateProductSchema,getProductSchema,deleteProductSchema } from '../schemas/products.schema.js';
import { isValid } from 'zod/v3';

const router = Router();

// Product routes
router.post('/products', validateSchema(insertProductSchema), insertProduct);
router.get('/products/:id', validateSchema(getProductSchema), getProduct);
router.get('/products', listProduct);
router.delete('/products/:id', validateSchema(deleteProductSchema), deleteProduct);
router.put('/products/:id', validateSchema(updateProductSchema), updateProduct);
export default router;