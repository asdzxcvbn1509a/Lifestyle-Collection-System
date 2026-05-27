import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { idParam, emptyToUndefined } from '../lib/zodHelpers.js';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getSystemSettings,
  updateSystemSettings,
} from '../controllers/admin.controller.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const createUserSchema = z.object({
  email: z.string().trim().email(),
  username: z.string().trim().min(3).max(30),
  password: z.string().min(6).max(100),
  displayName: z.string().trim().max(60).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

const updateUserSchema = z.object({
  displayName: z.string().trim().max(60).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  password: z.preprocess(emptyToUndefined, z.string().min(6).max(100).optional()),
});

const booleanish = z.union([z.boolean(), z.enum(['true', 'false'])]);
const settingsSchema = z.object({
  siteName: z.string().trim().max(120).optional(),
  allowRegistration: booleanish.optional(),
  maintenanceMode: booleanish.optional(),
});

// UC-09: Manage Users
router.get('/users', asyncHandler(listUsers));
router.post('/users', validate({ body: createUserSchema }), asyncHandler(createUser));
router.put('/users/:id', validate({ params: idParam, body: updateUserSchema }), asyncHandler(updateUser));
router.delete('/users/:id', validate({ params: idParam }), asyncHandler(deleteUser));

// UC-10: Manage System
router.get('/settings', asyncHandler(getSystemSettings));
router.put('/settings', validate({ body: settingsSchema }), asyncHandler(updateSystemSettings));

export default router;
