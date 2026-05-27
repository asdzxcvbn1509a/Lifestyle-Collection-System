import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../lib/hash.js';
import { publicUser } from '../lib/serialize.js';
import { uploadImage, deleteImage } from '../lib/cloudinary.js';
import { AppError } from '../middleware/error.js';

// UC-03: view own profile
export async function getMe(req, res) {
  res.json({ user: req.user });
}

// UC-03: update display name and/or avatar image
export async function updateMe(req, res) {
  const data = {};
  if (typeof req.body.displayName === 'string') data.displayName = req.body.displayName;

  // req.user (from auth) doesn't carry avatarPublicId, so fetch it before replacing.
  let old = null;
  if (req.file) {
    old = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatarUrl: true, avatarPublicId: true },
    });
    const uploaded = await uploadImage(req.file, 'lifestyle-collection/avatars');
    data.avatarUrl = uploaded.url;
    data.avatarPublicId = uploaded.publicId;
  }

  const user = await prisma.user.update({ where: { id: req.user.id }, data });

  // Remove the previous avatar once the new one is saved.
  if (req.file && old?.avatarUrl) {
    await deleteImage({ publicId: old.avatarPublicId, url: old.avatarUrl });
  }

  res.json({ user: publicUser(user) });
}

// UC-03: change password
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user.passwordHash) {
    throw new AppError(400, 'บัญชีนี้ล็อกอินด้วย Google ยังไม่มีรหัสผ่าน');
  }
  if (!(await comparePassword(currentPassword, user.passwordHash))) {
    throw new AppError(400, 'Current password is incorrect');
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  res.json({ message: 'Password updated successfully' });
}
