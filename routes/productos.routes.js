import { Router } from 'express';
// Controllers
import {insertProduct,deleteProduct,updateProduct, getProduct,listProduct } from '../controllers/products.controller.js';
// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import { insertProductSchema,updateProductSchema,getProductSchema,deleteProductSchema } from '../schemas/products.schema.js';
import { isValid } from 'zod/v3';

const router = Router();

// Product routes
router.post('/insertProduct', validateSchema(insertProductSchema), insertProduct);
router.get('/getProduct', validateSchema(getProductSchema), getProduct);
router.get('/listProduct', listProduct);
router.delete('/deleteProduct', validateSchema(deleteProductSchema), deleteProduct);
router.put('/updateProduct', validateSchema(updateProductSchema), updateProduct);
export default router;