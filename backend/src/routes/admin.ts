import { Router } from 'express';
import { login, refreshToken, getProfile } from '../controllers/authController';
import {
    getAllMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    toggleMediaStatus,
    toggleFeaturedStatus,
    toggleVerifiedStatus,
} from '../controllers/adminMediaController';
import {
    getAllRequests,
    getRequestById,
    updateRequestStatus,
    approveRequest,
    rejectRequest,
    deleteRequest,
} from '../controllers/adminRequestController';
import { getSiteConfig, updateSiteConfig } from '../controllers/siteConfigController';
import { getDashboardStats } from '../controllers/dashboardController';
import { getMediaAnalytics, getTopMedia, getRealTimeStats } from '../controllers/statsController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';
import { authLimiter, apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Auth routes (no authentication required)
router.post('/login', authLimiter, validateRequest({ body: schemas.adminLogin }), login);
router.post('/refresh', validateRequest({ body: schemas.refreshToken }), refreshToken);

// Apply authentication to all routes below
router.use(authenticateToken);
router.use(apiLimiter);

// Profile routes
router.get('/profile', getProfile);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/stats/media/:id', validateRequest({ params: schemas.uuidParam }), getMediaAnalytics);
router.get('/stats/top', getTopMedia);
router.get('/stats/realtime', getRealTimeStats);

// Media management routes
router.get('/media', validateRequest({ query: schemas.pagination }), getAllMedia);
router.post('/media', validateRequest({ body: schemas.mediaCreate }), createMedia);
router.put('/media/:id',
    validateRequest({
        params: schemas.uuidParam,
        body: schemas.mediaUpdate
    }),
    updateMedia
);
router.delete('/media/:id', validateRequest({ params: schemas.uuidParam }), deleteMedia);
router.patch('/media/:id/status', validateRequest({ params: schemas.uuidParam }), toggleMediaStatus);
router.patch('/media/:id/featured', validateRequest({ params: schemas.uuidParam }), toggleFeaturedStatus);
router.patch('/media/:id/verified', validateRequest({ params: schemas.uuidParam }), toggleVerifiedStatus);

// Request management routes
router.get('/requests', validateRequest({ query: schemas.pagination }), getAllRequests);
router.get('/requests/:id', validateRequest({ params: schemas.integerParam }), getRequestById);
router.put('/requests/:id', validateRequest({ 
    params: schemas.integerParam,
    body: schemas.requestStatusUpdate 
}), updateRequestStatus);
router.post('/requests/:id/approve', validateRequest({ params: schemas.integerParam }), approveRequest);
router.post('/requests/:id/reject',
    validateRequest({
        params: schemas.integerParam,
        body: schemas.rejectionReason
    }),
    rejectRequest
);
router.delete('/requests/:id', validateRequest({ params: schemas.integerParam }), deleteRequest);

// Site configuration routes
router.get('/config', getSiteConfig);
router.put('/config', updateSiteConfig);

export default router;