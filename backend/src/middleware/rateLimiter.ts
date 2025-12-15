import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // More permissive in development
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: process.env.NODE_ENV === 'development' ? () => false : undefined, // Don't skip in development, but allow more requests
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: {
      error: 'Too many join requests',
      message: 'Too many join requests from this IP, please try again tomorrow.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });