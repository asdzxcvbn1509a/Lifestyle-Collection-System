import { prisma } from '../lib/prisma.js';
import { uploadImage, deleteImage } from '../lib/cloudinary.js';
import { AppError } from '../middleware/error.js';

const ITEM_FOLDER = 'lifestyle-collection/items';

async function getOwnedItem(id, ownerId) {
  const item = await prisma.item.findFirst({ where: { id, ownerId } });
  if (!item) throw new AppError(404, 'Item not found');
  return item;
}

async function assertOwnedCategory(categoryId, ownerId) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, ownerId } });
  if (!category) throw new AppError(400, 'Category not found or not owned by you');
}

const withCategory = { category: { select: { id: true, name: true, icon: true } } };

const SORT_ORDERS = {
  newest: [{ createdAt: 'desc' }],
  oldest: [{ createdAt: 'asc' }],
  rating: [{ rating: 'desc' }, { createdAt: 'desc' }],
  name: [{ name: 'asc' }],
};

// UC-04/07: list, search (q), filter (categoryId / favorite), sort
export async function listItems(req, res) {
  const { categoryId, q, favorite, sort } = req.validatedQuery ?? {};
  const where = { ownerId: req.user.id };
  if (categoryId) where.categoryId = categoryId;
  if (favorite === true) where.isFavorite = true;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { detail: { contains: q, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.item.findMany({
    where,
    include: withCategory,
    orderBy: SORT_ORDERS[sort] ?? SORT_ORDERS.newest,
  });
  res.json({ items });
}

export async function getItem(req, res) {
  const item = await prisma.item.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    include: withCategory,
  });
  if (!item) throw new AppError(404, 'Item not found');
  res.json({ item });
}

// UC-04: create item (optional image upload)
export async function createItem(req, res) {
  const { name, detail, rating, categoryId } = req.body;
  await assertOwnedCategory(categoryId, req.user.id);

  const uploaded = await uploadImage(req.file, ITEM_FOLDER);
  const item = await prisma.item.create({
    data: {
      name,
      detail,
      rating,
      categoryId,
      ownerId: req.user.id,
      imageUrl: uploaded?.url ?? null,
      imagePublicId: uploaded?.publicId ?? null,
    },
    include: withCategory,
  });
  res.status(201).json({ item });
}

// UC-05: edit item
export async function updateItem(req, res) {
  const existing = await getOwnedItem(req.params.id, req.user.id);
  const { name, detail, rating, categoryId } = req.body;

  const data = { name, detail, rating };
  if (categoryId !== undefined) {
    await assertOwnedCategory(categoryId, req.user.id);
    data.categoryId = categoryId;
  }
  if (req.file) {
    const uploaded = await uploadImage(req.file, ITEM_FOLDER);
    data.imageUrl = uploaded.url;
    data.imagePublicId = uploaded.publicId;
  }

  const item = await prisma.item.update({
    where: { id: req.params.id },
    data,
    include: withCategory,
  });

  // Remove the previous image once the new one is saved.
  if (req.file && existing.imageUrl) {
    await deleteImage({ publicId: existing.imagePublicId, url: existing.imageUrl });
  }

  res.json({ item });
}

// UC-06: delete item
export async function deleteItem(req, res) {
  const existing = await getOwnedItem(req.params.id, req.user.id);
  await prisma.item.delete({ where: { id: req.params.id } });
  if (existing.imageUrl) {
    await deleteImage({ publicId: existing.imagePublicId, url: existing.imageUrl });
  }
  res.json({ message: 'Item deleted' });
}

// Favorite toggle (the heart in the wireframe)
export async function toggleFavorite(req, res) {
  const item = await getOwnedItem(req.params.id, req.user.id);
  const next = typeof req.body.isFavorite === 'boolean' ? req.body.isFavorite : !item.isFavorite;
  const updated = await prisma.item.update({
    where: { id: item.id },
    data: { isFavorite: next },
    include: withCategory,
  });
  res.json({ item: updated });
}
