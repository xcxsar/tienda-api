import { Router } from 'express';
// Controller
import {createSales,getMostRecentSale,getsaleDetailsBySaleId} from '../controllers/ventas.controller.js';
//Validation middlewares
import { authRequired } from '../middlewares/validateToken.js';
// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createSalesSchema,getsaleDetailsBySaleIdSchema } from '../schemas/ventas.schema.js';
import { isValid } from 'zod/v3';

const router = Router();
// Ventas routes
router.post('/sales', authRequired, validateSchema(createSalesSchema), createSales);
router.get('/sales/:id',validateSchema(getsaleDetailsBySaleIdSchema), getsaleDetailsBySaleId);
router.get('/sales', getMostRecentSale);

export default router;