import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { getPublicSettings } from '../controllers/settings.controller.js';

const router = Router();

// GET /api/settings/public — readable by anyone (login page, navbar, maintenance gate).
router.get('/public', asyncHandler(getPublicSettings));

export default router;
