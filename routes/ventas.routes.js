import { Router } from 'express';
// Controller

//Validation middlewares
import { authRequired } from '../middlewares/validateToken.js';
// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { isValid } from 'zod/v3';

const router = Router();
// Ventas routes


export default router;