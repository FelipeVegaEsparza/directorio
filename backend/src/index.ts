import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { syncDatabase } from './database/sync';
import { seedDemoData } from './database/seeders/demo-data';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Easypanel/Docker
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Debug Middleware for CORS
app.use((req, res, next) => {
  console.log('🔍 Request Origin:', req.headers.origin);
  console.log('⚙️  Configured Frontend URL:', process.env.FRONTEND_URL);
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow if origin matches FRONTEND_URL
    if (origin === allowedOrigin) return callback(null, true);

    // Allow if origin matches the Easypanel domain pattern (for easier deployment)
    if (origin.endsWith('.easypanel.host')) return callback(null, true);

    // Allow localhost in development
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) return callback(null, true);

    console.warn(`⚠️  Blocked by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads with CORS headers
app.use('/uploads', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use(routes);

// API info endpoint
app.get('/api', (_req: express.Request, res: express.Response) => {
  res.json({
    message: 'Radio & TV Directory API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      public: '/api',
      admin: '/api/admin',
      requests: '/api/requests',
      upload: '/api/admin/upload'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Sync database on startup
    await syncDatabase();

    // Note: Demo data seeding is disabled by default
    // Run 'npm run db:seed' manually if you need sample data

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Admin login: http://localhost:3000/admin/login`);
        console.log(`   Username: admin | Password: admin123`);
      }
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;