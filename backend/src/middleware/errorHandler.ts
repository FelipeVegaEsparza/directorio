import { Request, Response, NextFunction } from 'express';
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err } as any;
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Sequelize validation error
  if (err instanceof ValidationError) {
    const message = err.errors.map(e => e.message).join(', ');
    error = new BadRequestError(`Validation error: ${message}`);
  }

  // Sequelize unique constraint error
  if (err instanceof UniqueConstraintError) {
    const field = err.errors[0]?.path || 'field';
    error = new BadRequestError(`${field} already exists`);
  }

  // Sequelize foreign key constraint error
  if (err instanceof ForeignKeyConstraintError) {
    error = new BadRequestError('Invalid reference to related resource');
  }

  // Mongoose cast error (if we were using MongoDB)
  if (err.name === 'CastError') {
    error = new BadRequestError('Invalid ID format');
  }

  // JWT errors are handled in auth middleware
  if (err.name === 'JsonWebTokenError') {
    error = new UnauthorizedError('Invalid token');
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};