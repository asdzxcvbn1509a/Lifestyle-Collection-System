import { verifyToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from './error.js';

/** Verify the Bearer token and attach the current user to req.user. */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new AppError(401, 'Authentication required');

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      throw new AppError(401, 'Invalid or expired token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, role: true },
    });
    if (!user) throw new AppError(401, 'User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/** Allow only ADMIN users. Must run after requireAuth. */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError(403, 'Admin access required'));
  }
  next();
}
