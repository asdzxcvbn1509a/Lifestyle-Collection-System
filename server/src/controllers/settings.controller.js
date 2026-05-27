import { getSettingsCached } from '../lib/settings.js';

// Public, unauthenticated view of display-related settings (siteName, maintenanceMode).
export async function getPublicSettings(req, res) {
  const settings = await getSettingsCached();
  res.json({
    settings: {
      siteName: settings.siteName,
      maintenanceMode: settings.maintenanceMode,
    },
  });
}
