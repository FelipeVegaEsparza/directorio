import { Router } from 'express';
import publicRoutes from './public';
import requestRoutes from './requests';
import adminRoutes from './admin';
import uploadRoutes from './upload';

const router = Router();

// Public API routes
router.use('/api', publicRoutes);

// Request routes
router.use('/api/requests', requestRoutes);

// Admin routes
router.use('/api/admin', adminRoutes);

// Upload routes (admin only)
router.use('/api/admin/upload', uploadRoutes);

export default router;