import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { summary } from '../controllers/stats.controller.js';

const router = Router();

// UC-08: behaviour summary / statistics
router.get('/', requireAuth, asyncHandler(summary));

export default router;
