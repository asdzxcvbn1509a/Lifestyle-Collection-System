import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../lib/hash.js';
import { signToken } from '../lib/jwt.js';
import { publicUser } from '../lib/serialize.js';
import { getSetting } from '../lib/settings.js';
import { verifyGoogleToken } from '../lib/google.js';
import { AppError } from '../middleware/error.js';

// Issue our own JWT + serialized user — the shape every auth endpoint returns.
function authResponse(res, user, status = 200) {
  const token = signToken({ sub: user.id, role: user.role });
  res.status(status).json({ token, user: publicUser(user) });
}

// Derive a unique username from an email local-part (a-z0-9, >= 3 chars),
// appending a number when it collides with an existing username.
async function makeUniqueUsername(email) {
  let base = (email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (base.length < 3) base = `${base}user`.slice(0, 12);
  let candidate = base;
  let n = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    n += 1;
    candidate = `${base}${n}`;
  }
  return candidate;
}

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

  authResponse(res, user, 201);
}

// UC-02: Login (identifier = email or username)
export async function login(req, res) {
  const { identifier, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
  });
  // Google-only accounts have no passwordHash and cannot log in this way.
  if (!user || !user.passwordHash || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError(401, 'Invalid username/email or password');
  }

  authResponse(res, user);
}

// Login / sign-up with a Google ID token (credential) from the client.
export async function googleLogin(req, res) {
  const { sub, email, emailVerified, name, picture } = await verifyGoogleToken(req.body.credential);

  // 1) Returning Google user.
  const byGoogle = await prisma.user.findUnique({ where: { googleId: sub } });
  if (byGoogle) return authResponse(res, byGoogle);

  // 2) Existing email/password account with a verified matching email → link it.
  const byEmail = emailVerified ? await prisma.user.findUnique({ where: { email } }) : null;
  if (byEmail) {
    const linked = await prisma.user.update({
      where: { id: byEmail.id },
      data: { googleId: sub, avatarUrl: byEmail.avatarUrl || picture || null },
    });
    return authResponse(res, linked);
  }

  // 3) Brand-new email → create an account (respecting the registration toggle).
  if ((await getSetting('allowRegistration')) === 'false') {
    throw new AppError(403, 'Registration is currently disabled by the administrator');
  }
  const created = await prisma.user.create({
    data: {
      email,
      username: await makeUniqueUsername(email),
      displayName: name || email.split('@')[0],
      avatarUrl: picture || null,
      googleId: sub,
      passwordHash: null,
    },
  });
  authResponse(res, created, 201);
}

// Current authenticated user.
export async function me(req, res) {
  res.json({ user: req.user });
}
