import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.js';

async function getOwnedCategory(id, ownerId) {
  const category = await prisma.category.findFirst({ where: { id, ownerId } });
  if (!category) throw new AppError(404, 'Category not found');
  return category;
}

// UC-04/07: list own categories (with item counts)
export async function listCategories(req, res) {
  const categories = await prisma.category.findMany({
    where: { ownerId: req.user.id },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ categories });
}

export async function getCategory(req, res) {
  const category = await prisma.category.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    include: { _count: { select: { items: true } } },
  });
  if (!category) throw new AppError(404, 'Category not found');
  res.json({ category });
}

// UC-04: create category
export async function createCategory(req, res) {
  const { name, detail, icon } = req.body;
  const category = await prisma.category.create({
    data: { name, detail, icon, ownerId: req.user.id },
  });
  res.status(201).json({ category });
}

// UC-05: edit category
export async function updateCategory(req, res) {
  await getOwnedCategory(req.params.id, req.user.id);
  const { name, detail, icon } = req.body;
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name, detail, icon },
  });
  res.json({ category });
}

// UC-06: delete category (items cascade)
export async function deleteCategory(req, res) {
  await getOwnedCategory(req.params.id, req.user.id);
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ message: 'Category deleted' });
}
