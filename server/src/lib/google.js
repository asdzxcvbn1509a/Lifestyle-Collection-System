import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../middleware/error.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Verify a Google ID token (the "credential" from Google Identity Services)
// and return the useful profile fields. Throws 401 if the token is invalid.
export async function verifyGoogleToken(credential) {
  if (!CLIENT_ID) throw new AppError(500, 'ยังไม่ได้ตั้งค่า GOOGLE_CLIENT_ID บนเซิร์ฟเวอร์');
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(401, 'ยืนยันบัญชี Google ไม่สำเร็จ');
  }
  if (!payload?.email) throw new AppError(401, 'บัญชี Google ไม่มีอีเมล');
  return {
    sub: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified === true,
    name: payload.name,
    picture: payload.picture,
  };
}
