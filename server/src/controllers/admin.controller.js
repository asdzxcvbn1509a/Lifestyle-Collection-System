import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../lib/hash.js';
import { publicUser } from '../lib/serialize.js';
import { getSettings, DEFAULT_SETTINGS, invalidateSettingsCache } from '../lib/settings.js';
import { AppError } from '../middleware/error.js';

// ===== UC-09: Manage Users =====
export async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      _count: { select: { categories: true, items: true } },
    },
  });
  res.json({ users });
}

export async function createUser(req, res) {
  const { email, username, password, displayName, role } = req.body;
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: await hashPassword(password),
      displayName: displayName || username,
      role: role || 'USER',
    },
  });
  res.status(201).json({ user: publicUser(user) });
}

export async function updateUser(req, res) {
  const { displayName, role, password } = req.body;

  if (req.params.id === req.user.id && role && role !== 'ADMIN') {
    throw new AppError(400, 'You cannot remove your own admin role');
  }

  const data = {};
  if (displayName !== undefined) data.displayName = displayName;
  if (role !== undefined) data.role = role;
  if (password) data.passwordHash = await hashPassword(password);

  const user = await prisma.user.update({ where: { id: req.params.id }, data });
  res.json({ user: publicUser(user) });
}

export async function deleteUser(req, res) {
  if (req.params.id === req.user.id) {
    throw new AppError(400, 'You cannot delete your own account');
  }
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
}

// ===== UC-10: Manage System (settings) =====
export async function getSystemSettings(req, res) {
  res.json({ settings: await getSettings() });
}

export async function updateSystemSettings(req, res) {
  const allowedKeys = Object.keys(DEFAULT_SETTINGS);
  const entries = Object.entries(req.body).filter(([key]) => allowedKeys.includes(key));

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );
  invalidateSettingsCache();
  res.json({ settings: await getSettings() });
}
