import { Router } from 'express';
// Controllers
import { login, register, logout, profile, verifyToken } from "../controllers/auth.controller.js";
//Validation middlewares
import { authRequired } from '../middlewares/validateToken.js';
// Import validation schemas
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { isValid } from 'zod/v3';

const router = Router();
router.post('/auth/login', validateSchema(loginSchema), login);
router.post('/auth/register', validateSchema(registerSchema), register);
router.post('/auth/logout', logout);
router.get('/auth/verify',verifyToken);
router.get('/auth/profile', authRequired, profile);
export default router;