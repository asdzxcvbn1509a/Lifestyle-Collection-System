import { prisma } from '../lib/prisma.js';

// UC-08: behaviour summary / statistics for the current user
export async function summary(req, res) {
  const ownerId = req.user.id;

  const [categoryCount, itemCount, favoriteCount, categories, items] = await Promise.all([
    prisma.category.count({ where: { ownerId } }),
    prisma.item.count({ where: { ownerId } }),
    prisma.item.count({ where: { ownerId, isFavorite: true } }),
    prisma.category.findMany({
      where: { ownerId },
      select: { id: true, name: true, icon: true, _count: { select: { items: true } } },
      orderBy: { items: { _count: 'desc' } },
    }),
    prisma.item.findMany({ where: { ownerId }, select: { createdAt: true, rating: true } }),
  ]);

  const itemsPerCategory = categories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    count: c._count.items,
  }));

  // Items added per day for the last 14 days.
  const days = 14;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    series.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  const indexByDate = new Map(series.map((s, idx) => [s.date, idx]));
  for (const it of items) {
    const key = new Date(it.createdAt).toISOString().slice(0, 10);
    if (indexByDate.has(key)) series[indexByDate.get(key)].count += 1;
  }

  // Rating distribution and average.
  const ratingDistribution = [1, 2, 3, 4, 5].map((r) => ({
    rating: r,
    count: items.filter((it) => it.rating === r).length,
  }));
  const rated = items.filter((it) => typeof it.rating === 'number');
  const avgRating = rated.length
    ? Number((rated.reduce((s, it) => s + it.rating, 0) / rated.length).toFixed(2))
    : 0;

  res.json({
    totals: { categories: categoryCount, items: itemCount, favorites: favoriteCount, avgRating },
    itemsPerCategory,
    activity: series,
    ratingDistribution,
  });
}
