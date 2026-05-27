import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { maintenanceGuard } from '../middleware/maintenance.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { idParam, emptyToUndefined } from '../lib/zodHelpers.js';
import {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  toggleFavorite,
} from '../controllers/item.controller.js';

const router = Router();
router.use(requireAuth);

const listQuerySchema = z.object({
  categoryId: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
  q: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  favorite: z.preprocess(
    emptyToUndefined,
    z.enum(['true', 'false']).transform((v) => v === 'true').optional()
  ),
  sort: z.preprocess(emptyToUndefined, z.enum(['newest', 'oldest', 'rating', 'name']).optional()),
});

// Multipart form fields arrive as strings, so coerce numbers here.
const itemBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  detail: z.preprocess(emptyToUndefined, z.string().trim().max(4000).optional()),
  rating: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(5).optional()),
  categoryId: z.coerce.number().int().positive(),
});

const favoriteSchema = z.object({ isFavorite: z.boolean().optional() });

router.get('/', validate({ query: listQuerySchema }), asyncHandler(listItems));
router.post(
  '/',
  maintenanceGuard,
  upload.single('image'),
  validate({ body: itemBodySchema }),
  asyncHandler(createItem)
);
router.get('/:id', validate({ params: idParam }), asyncHandler(getItem));
router.put(
  '/:id',
  maintenanceGuard,
  upload.single('image'),
  validate({ params: idParam, body: itemBodySchema }),
  asyncHandler(updateItem)
);
router.delete('/:id', maintenanceGuard, validate({ params: idParam }), asyncHandler(deleteItem));
router.patch(
  '/:id/favorite',
  maintenanceGuard,
  validate({ params: idParam, body: favoriteSchema }),
  asyncHandler(toggleFavorite)
);

export default router;
