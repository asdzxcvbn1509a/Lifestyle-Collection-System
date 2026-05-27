import 'dotenv/config';
import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const app = createApp();
const rnd = Date.now().toString().slice(-7);
const header = () => ({ Authorization: `Bearer ${adminToken}` });

let adminToken;
let createdUserId;

describe('Admin API (integration)', () => {
  afterAll(async () => {
    if (createdUserId) await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    // Always leave registration enabled for other suites.
    await prisma.systemSetting.upsert({
      where: { key: 'allowRegistration' },
      update: { value: 'true' },
      create: { key: 'allowRegistration', value: 'true' },
    });
    await prisma.$disconnect();
  });

  it('logs in as the seeded admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'admin@demo.com', password: 'admin1234' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('ADMIN');
    adminToken = res.body.token;
  });

  it('UC-09: lists users', async () => {
    const res = await request(app).get('/api/admin/users').set(header());
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBeGreaterThanOrEqual(2);
  });

  it('UC-09: creates, promotes, then deletes a user', async () => {
    const create = await request(app)
      .post('/api/admin/users')
      .set(header())
      .send({ email: `adm${rnd}@e.com`, username: `adm${rnd}`, password: 'pass123', role: 'USER' });
    expect(create.status).toBe(201);
    createdUserId = create.body.user.id;

    const upd = await request(app).put(`/api/admin/users/${createdUserId}`).set(header()).send({ role: 'ADMIN' });
    expect(upd.status).toBe(200);
    expect(upd.body.user.role).toBe('ADMIN');

    const del = await request(app).delete(`/api/admin/users/${createdUserId}`).set(header());
    expect(del.status).toBe(200);
    createdUserId = null;
  });

  it('UC-10: updates settings and enforces allowRegistration', async () => {
    const off = await request(app).put('/api/admin/settings').set(header()).send({ allowRegistration: false });
    expect(off.status).toBe(200);
    expect(off.body.settings.allowRegistration).toBe('false');

    const blocked = await request(app)
      .post('/api/auth/register')
      .send({ email: `blk${rnd}@e.com`, username: `blk${rnd}`, password: 'pass123' });
    expect(blocked.status).toBe(403);

    const on = await request(app).put('/api/admin/settings').set(header()).send({ allowRegistration: true });
    expect(on.body.settings.allowRegistration).toBe('true');
  });
});
