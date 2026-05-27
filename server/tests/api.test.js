import 'dotenv/config';
import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

// Integration tests — require a reachable PostgreSQL (DATABASE_URL in server/.env).
const app = createApp();
const rnd = Date.now().toString().slice(-7);
const email = `apitest${rnd}@e.com`;

let token;
let userId;
let categoryId;

describe('Auth + Category API (integration)', () => {
  afterAll(async () => {
    if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('UC-01: registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, username: `api${rnd}`, password: 'pass123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.passwordHash).toBeUndefined();
    token = res.body.token;
    userId = res.body.user.id;
  });

  it('UC-02: logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: email, password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('UC-02: rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: email, password: 'nope' });
    expect(res.status).toBe(401);
  });

  it('blocks unauthenticated access to protected routes', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(401);
  });

  it('UC-04: creates a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test', icon: 'Star' });
    expect(res.status).toBe(201);
    expect(res.body.category.name).toBe('Test');
    categoryId = res.body.category.id;
  });

  it('UC-05 / UC-06: updates then deletes the category', async () => {
    const upd = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Renamed' });
    expect(upd.status).toBe(200);
    expect(upd.body.category.name).toBe('Test Renamed');

    const del = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
  });

  it('rejects admin routes for a normal user', async () => {
    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
