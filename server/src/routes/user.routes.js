import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { maintenanceGuard } from '../middleware/maintenance.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { getMe, updateMe, changePassword } from '../controllers/user.controller.js';

const router = Router();

const updateMeSchema = z.object({
  displayName: z.string().trim().max(60).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

router.get('/me', requireAuth, asyncHandler(getMe));
router.put(
  '/me',
  requireAuth,
  maintenanceGuard,
  upload.single('avatar'),
  validate({ body: updateMeSchema }),
  asyncHandler(updateMe)
);
router.put(
  '/me/password',
  requireAuth,
  maintenanceGuard,
  validate({ body: passwordSchema }),
  asyncHandler(changePassword)
);

export default router;
