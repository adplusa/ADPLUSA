import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { dbConnection } from './database/connection';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import imageRoutes from './routes/image.routes';
import presignedRoutes from './routes/presigned.routes';
import tagRoutes from './routes/tag.routes';
import mediaRoutes from './routes/media.routes';
import projectRoutes from './routes/project.routes';
import serviceRoutes from './routes/service.routes';
import contentRoutes from './routes/content.routes';
import publicRoutes from './routes/public.routes';
import contactRoutes from './routes/contact.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { cacheMiddleware } from './middleware/cache.middleware';

const app: Application = express();

// Middleware
// CORS configuration
const origins = config.corsOrigin.split(',').map(o => o.trim());
app.use(cors({ origin: origins, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cacheMiddleware);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  const dbStatus = dbConnection.getConnectionStatus();
  
  res.status(dbStatus ? 200 : 503).json({
    success: dbStatus,
    message: dbStatus ? 'API is running' : 'API is running but database is disconnected',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: {
      connected: dbStatus,
    },
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Architect CMS API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Admin routes (protected)
app.use('/api/admin', adminRoutes);
app.use('/api/admin', presignedRoutes);
app.use('/api/admin/tags', tagRoutes);
app.use('/api/admin/media', mediaRoutes);

// Image upload routes (already under /api/admin)
app.use('/api/admin', imageRoutes);

// Public content routes
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', contentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
