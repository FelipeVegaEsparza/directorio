import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models';
import config from '../config';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
  }
}

export interface JWTPayload {
  id: number;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid access token' 
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret as string) as JWTPayload;
    
    // Check if user still exists and is active
    const admin = await Admin.findOne({
      where: { 
        id: decoded.id,
        isActive: true 
      }
    });

    if (!admin) {
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found or inactive' 
      });
      return;
    }

    // Add user info to request
    req.user = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token is malformed or expired' 
      });
      return;
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication error',
      message: 'Internal server error during authentication' 
    });
    return;
  }
};

export const generateTokens = (admin: Admin) => {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
  };

  const accessToken = jwt.sign(payload, config.jwt.secret as string, {
    expiresIn: config.jwt.expiresIn as string,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret as string, {
    expiresIn: config.jwt.refreshExpiresIn as string,
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.refreshSecret as string) as JWTPayload;
};