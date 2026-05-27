import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../lib/hash.js';
import { signToken } from '../lib/jwt.js';
import { publicUser } from '../lib/serialize.js';
import { getSetting } from '../lib/settings.js';
import { AppError } from '../middleware/error.js';

// UC-01: Register
export async function register(req, res) {
  if ((await getSetting('allowRegistration')) === 'false') {
    throw new AppError(403, 'Registration is currently disabled by the administrator');
  }
  const { email, username, password, displayName } = req.body;

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: await hashPassword(password),
      displayName: displayName || username,
    },
  });

  const token = signToken({ sub: user.id, role: user.role });
  res.status(201).json({ token, user: publicUser(user) });
}

// UC-02: Login (identifier = email or username)
export async function login(req, res) {
  const { identifier, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
  });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError(401, 'Invalid username/email or password');
  }

  const token = signToken({ sub: user.id, role: user.role });
  res.json({ token, user: publicUser(user) });
}

// Current authenticated user.
export async function me(req, res) {
  res.json({ user: req.user });
}
