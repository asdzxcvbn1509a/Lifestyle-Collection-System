import { getSettingsCached } from '../lib/settings.js';
import { AppError } from './error.js';

// Block write operations for non-admin users while maintenance mode is on.
// Must run after requireAuth (it reads req.user.role). Admins are exempt so
// they can keep managing the system and turn maintenance back off.
export async function maintenanceGuard(req, res, next) {
  try {
    const settings = await getSettingsCached();
    if (settings.maintenanceMode === 'true' && req.user?.role !== 'ADMIN') {
      throw new AppError(503, 'ระบบกำลังปิดปรับปรุง กรุณาลองใหม่ภายหลัง');
    }
    next();
  } catch (err) {
    next(err);
  }
}
