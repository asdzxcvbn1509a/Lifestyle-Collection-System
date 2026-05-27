import { prisma } from './prisma.js';

// System settings managed by admins (UC-10). Stored as string key/value rows.
export const DEFAULT_SETTINGS = {
  siteName: 'Lifestyle Collection',
  allowRegistration: 'true',
  maintenanceMode: 'false',
};

/** Return all settings, with defaults filled in for any missing keys. */
export async function getSettings() {
  const rows = await prisma.systemSetting.findMany();
  const merged = { ...DEFAULT_SETTINGS };
  for (const row of rows) merged[row.key] = row.value;
  return merged;
}

/** Return a single setting value (falls back to its default). */
export async function getSetting(key) {
  const row = await prisma.systemSetting.findUnique({ where: { key } });
  return row ? row.value : DEFAULT_SETTINGS[key];
}

// Short-lived cache so hot paths (maintenance guard, public settings) avoid a
// DB read on every request. Invalidated whenever settings are updated.
let _cache = null;
let _cacheAt = 0;

export async function getSettingsCached(ttlMs = 15000) {
  if (_cache && Date.now() - _cacheAt < ttlMs) return _cache;
  _cache = await getSettings();
  _cacheAt = Date.now();
  return _cache;
}

export function invalidateSettingsCache() {
  _cache = null;
}
