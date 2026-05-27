import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const app = createApp();
const rnd = Date.now().toString().slice(-7);
const header = () => ({ Authorization: `Bearer ${token}` });

let token;
let userId;
let categoryId;
let itemId;

describe('Item API + stats (integration)', () => {
  beforeAll(async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: `item${rnd}@e.com`, username: `item${rnd}`, password: 'pass123' });
    token = reg.body.token;
    userId = reg.body.user.id;

    const cat = await request(app).post('/api/categories').set(header()).send({ name: 'ItemsCat', icon: 'Star' });
    categoryId = cat.body.category.id;
  });

  afterAll(async () => {
    if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('UC-04: creates an item', async () => {
    const res = await request(app)
      .post('/api/items')
      .set(header())
      .send({ name: 'Espresso', detail: 'strong', rating: 5, categoryId });
    expect(res.status).toBe(201);
    expect(res.body.item.name).toBe('Espresso');
    itemId = res.body.item.id;
  });

  it('lists items in the category', async () => {
    const res = await request(app).get(`/api/items?categoryId=${categoryId}`).set(header());
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
  });

  it('UC-07: searches items by q', async () => {
    const res = await request(app).get('/api/items?q=Espre').set(header());
    expect(res.status).toBe(200);
    expect(res.body.items.some((i) => i.id === itemId)).toBe(true);
  });

  it('toggles favorite and filters by it', async () => {
    const res = await request(app).patch(`/api/items/${itemId}/favorite`).set(header()).send({ isFavorite: true });
    expect(res.status).toBe(200);
    expect(res.body.item.isFavorite).toBe(true);

    const fav = await request(app).get('/api/items?favorite=true').set(header());
    expect(fav.body.items.length).toBeGreaterThan(0);
    expect(fav.body.items.every((i) => i.isFavorite)).toBe(true);
  });

  it('UC-08: returns the stats shape', async () => {
    const res = await request(app).get('/api/stats').set(header());
    expect(res.status).toBe(200);
    expect(res.body.totals.items).toBeGreaterThan(0);
    expect(res.body.activity).toHaveLength(14);
    expect(res.body.ratingDistribution).toHaveLength(5);
  });

  it('UC-06: deletes the item', async () => {
    const res = await request(app).delete(`/api/items/${itemId}`).set(header());
    expect(res.status).toBe(200);
  });
});
