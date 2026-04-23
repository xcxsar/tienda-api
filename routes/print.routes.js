import { Router } from 'express';
// Controllers

// Import validation schemas
import {printReceipt } from '../controllers/print.controller.js';

const router = Router();

// Category routes
router.post('/print', printReceipt);

export default router;