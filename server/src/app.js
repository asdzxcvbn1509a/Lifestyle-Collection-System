import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import itemRoutes from './routes/item.routes.js';
import statsRoutes from './routes/stats.routes.js';
import adminRoutes from './routes/admin.routes.js';
import settingsRoutes from './routes/settings.routes.js';

export function createApp() {
  const app = express();

  // Behind Render's reverse proxy — trust it so req.ip / rate-limit see the real client IP.
  app.set('trust proxy', 1);

  // Security headers. Allow images to be embedded cross-origin (served by Cloudinary).
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  const origins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
    : '*';

  app.use(cors({ origin: origins, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Feature routers.
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/items', itemRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/settings', settingsRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
