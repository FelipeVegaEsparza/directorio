import { Router } from 'express';
import { submitJoinRequest, getRequestStatus } from '../controllers/requestController';
import { validateRequest, schemas } from '../middleware/validation';
import { joinRequestLimiter } from '../middleware/rateLimiter';

const router = Router();

// Submit join request (with strict rate limiting)
router.post('/', 
  joinRequestLimiter,
  validateRequest({ body: schemas.joinRequest }), 
  submitJoinRequest
);

// Check request status
router.get('/status', getRequestStatus);

export default router;