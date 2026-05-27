import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import multer from 'multer';
import { MAX_UPLOAD_MB } from '../lib/uploadConfig.js';

/** Throwable error that carries an HTTP status code. */
export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Validation errors from Zod (build a field->messages map from issues;
  // version-safe across Zod 3/4).
  if (err instanceof ZodError) {
    const fieldErrors = {};
    for (const issue of err.issues) {
      const key = issue.path.length ? issue.path.join('.') : '_';
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return res.status(400).json({ message: 'Validation failed', errors: fieldErrors });
  }

  // File upload errors from multer.
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: `ไฟล์รูปใหญ่เกินไป (สูงสุด ${MAX_UPLOAD_MB} MB)` });
    }
    return res.status(400).json({ message: err.message });
  }

  // Known Prisma errors mapped to friendly HTTP codes.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = err.meta?.target;
      return res.status(409).json({ message: `Duplicate value for ${target ?? 'a unique field'}` });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found' });
    }
  }

  const status = err.statusCode || err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: err.message || 'Internal server error' });
}
