import rateLimit from 'express-rate-limit';

// Throttle auth attempts per IP to slow brute-force / abuse.
// Skipped under tests so the integration suite isn't rate-limited.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { message: 'พยายามเข้าสู่ระบบ/สมัครมากเกินไป กรุณาลองใหม่ภายหลัง' },
});
