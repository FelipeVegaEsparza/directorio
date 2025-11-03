import { Router } from 'express';
import { 
  getMedia, 
  getMediaById, 
  getFeaturedMedia, 
  getPopularMedia, 
  getRecentMedia 
} from '../controllers/mediaController';
import { getCategories, getCountries } from '../controllers/categoryController';
import { recordEvent, getOverviewStats } from '../controllers/statsController';
import { getSiteConfig } from '../controllers/siteConfigController';
import { validateRequest, schemas } from '../middleware/validation';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to all public routes
router.use(apiLimiter);

// Media routes
router.get('/media', validateRequest({ query: schemas.pagination }), getMedia);
router.get('/media/featured', getFeaturedMedia);
router.get('/media/popular', getPopularMedia);
router.get('/media/recent', getRecentMedia);
router.get('/media/:id', getMediaById);

// Categories and filters
router.get('/categories', getCategories);
router.get('/countries', getCountries);

// Site configuration (public)
router.get('/config', getSiteConfig);

// Stats routes
router.get('/stats/overview', getOverviewStats);
router.post('/stats/view/:id', 
  validateRequest({ 
    params: schemas.uuidParam,
    body: schemas.statsEvent 
  }), 
  recordEvent
);
router.post('/stats/play/:id', 
  validateRequest({ 
    params: schemas.uuidParam,
    body: schemas.statsEvent 
  }), 
  recordEvent
);

export default router;