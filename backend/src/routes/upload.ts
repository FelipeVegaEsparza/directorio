import { Router } from 'express';
import { upload, uploadFile, uploadFiles } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply authentication and rate limiting
router.use(authenticateToken);
router.use(uploadLimiter);

// Upload single file
router.post('/single', upload.single('file'), uploadFile);

// Upload multiple files
router.post('/multiple', upload.array('files', 5), uploadFiles);

export default router;