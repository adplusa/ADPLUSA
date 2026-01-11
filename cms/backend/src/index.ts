import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { dbConnection } from './database/connection';
import authRoutes from './routes/auth.routes';
import imageRoutes from './routes/image.routes';

const app: Application = express();

// Middleware
// CORS configuration for frontend access
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Parse allowed origins from environment variable (comma-separated)
    const allowedOrigins = config.corsOrigin.split(',').map(o => o.trim());

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
import adminRoutes from './routes/admin.routes';
import presignedRoutes from './routes/presigned.routes';
app.use('/api/admin', adminRoutes);
app.use('/api/admin', presignedRoutes);

// Image upload routes (already under /api/admin)
app.use('/api/admin', imageRoutes);

// Public content routes
import projectRoutes from './routes/project.routes';
import serviceRoutes from './routes/service.routes';
import contentRoutes from './routes/content.routes';

app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', contentRoutes);

// Error handling middleware (must be last)
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

async function startServer() {
  try {
    // Connect to MongoDB
    await dbConnection.connect();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
