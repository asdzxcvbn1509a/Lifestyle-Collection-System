import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { register, login, me } from '../controllers/auth.controller.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().trim().email(),
  username: z.string().trim().min(3).max(30),
  password: z.string().min(6).max(100),
  displayName: z.string().trim().max(60).optional(),
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
});

router.post('/register', authLimiter, validate({ body: registerSchema }), asyncHandler(register));
router.post('/login', authLimiter, validate({ body: loginSchema }), asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));

export default router;
