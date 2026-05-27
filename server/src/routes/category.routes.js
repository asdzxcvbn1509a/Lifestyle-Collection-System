import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { maintenanceGuard } from '../middleware/maintenance.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { idParam } from '../lib/zodHelpers.js';
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

const router = Router();
router.use(requireAuth);

const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  detail: z.string().trim().max(2000).optional(),
  icon: z.string().trim().max(60).optional(),
});

router.get('/', asyncHandler(listCategories));
router.post('/', maintenanceGuard, validate({ body: categorySchema }), asyncHandler(createCategory));
router.get('/:id', validate({ params: idParam }), asyncHandler(getCategory));
router.put('/:id', maintenanceGuard, validate({ params: idParam, body: categorySchema }), asyncHandler(updateCategory));
router.delete('/:id', maintenanceGuard, validate({ params: idParam }), asyncHandler(deleteCategory));

export default router;
