import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Validation failed',
        message: errors.join('; '),
        details: errors,
      });
      return;
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    category: Joi.string().optional(),
    country: Joi.string().optional(),
    type: Joi.string().valid('radio', 'tv').optional(),
    featured: Joi.boolean().optional(),
    verified: Joi.boolean().optional(),
    sort: Joi.string().valid('relevance', 'popular', 'recent', 'name', 'views', 'plays').optional(),
    status: Joi.string().valid('pending', 'approved', 'rejected', 'all').optional(),
  }),

  // UUID param
  uuidParam: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  // Integer param
  integerParam: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),

  // Media creation
  mediaCreate: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    type: Joi.string().valid('radio', 'tv').required(),
    description: Joi.string().allow('').optional(),
    streamUrl: Joi.string().uri().required(),
    logoUrl: Joi.string().allow('').optional(),
    bannerUrl: Joi.string().allow('').optional(),
    country: Joi.string().max(100).optional(),
    city: Joi.string().max(100).optional(),
    categoryId: Joi.number().integer().positive().allow(null).optional(),
    isActive: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    isVerified: Joi.boolean().optional(),
    socialLinks: Joi.array().items(
      Joi.object({
        platform: Joi.string().valid('website', 'facebook', 'instagram', 'twitter', 'youtube').required(),
        url: Joi.string().uri().required(),
      })
    ).optional(),
  }),

  // Media update
  mediaUpdate: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    type: Joi.string().valid('radio', 'tv').optional(),
    description: Joi.string().allow('').optional(),
    streamUrl: Joi.string().uri().optional(),
    logoUrl: Joi.string().allow('').optional(),
    bannerUrl: Joi.string().allow('').optional(),
    country: Joi.string().max(100).optional(),
    city: Joi.string().max(100).optional(),
    categoryId: Joi.number().integer().positive().allow(null).optional(),
    isActive: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    isVerified: Joi.boolean().optional(),
    socialLinks: Joi.array().items(
      Joi.object({
        platform: Joi.string().valid('website', 'facebook', 'instagram', 'twitter', 'youtube').required(),
        url: Joi.string().uri().required(),
      })
    ).optional(),
  }),

  // Join request
  joinRequest: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    email: Joi.string().email().required(),
    mediaName: Joi.string().min(1).max(255).required(),
    mediaType: Joi.string().valid('radio', 'tv').required(),
    streamUrl: Joi.string().uri().required(),
    description: Joi.string().allow('').optional(),
    country: Joi.string().max(100).optional(),
    city: Joi.string().max(100).optional(),
    website: Joi.string().uri().optional(),
    facebook: Joi.string().uri().optional(),
    instagram: Joi.string().uri().optional(),
    twitter: Joi.string().uri().optional(),
    youtube: Joi.string().uri().optional(),
  }),

  // Admin login
  adminLogin: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  // Stats event
  statsEvent: Joi.object({
    eventType: Joi.string().valid('view', 'play').required(),
  }),

  // Refresh token
  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  // Rejection reason
  rejectionReason: Joi.object({
    reason: Joi.string().optional(),
  }),

  // Request status update
  requestStatusUpdate: Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
    reason: Joi.string().optional(),
  }),
};