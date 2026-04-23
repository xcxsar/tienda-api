import { Router } from 'express';
// Controllers

// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import {printReceipt } from '../controllers/print.controller.js';
import {printReceiptSchema} from '../schemas/print.schema.js';
import { isValid } from 'zod/v3';

const router = Router();

// Category routes
router.post('/print', validateSchema(printReceiptSchema), printReceipt);

export default router;