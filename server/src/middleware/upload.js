import multer from 'multer';
import { MAX_UPLOAD_BYTES } from '../lib/uploadConfig.js';
import { AppError } from './error.js';

function imageFilter(req, file, cb) {
  if (/^image\/(png|jpe?g|gif|webp|svg\+xml)$/.test(file.mimetype)) cb(null, true);
  else cb(new AppError(400, 'รองรับเฉพาะไฟล์รูปภาพ (jpg, png, gif, webp)'));
}

// Files are kept in memory so they can be streamed straight to Cloudinary.
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_UPLOAD_BYTES },
});
