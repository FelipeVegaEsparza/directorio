import { Request, Response } from 'express';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Admin } from '../models';
import { generateTokens, verifyRefreshToken } from '../middleware/auth';
import { asyncHandler, UnauthorizedError, BadRequestError } from '../middleware/errorHandler';

// Admin login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Find admin by username or email
  const admin = await Admin.findOne({
    where: {
      [Op.or]: [
        { username },
        { email: username },
      ],
      isActive: true,
    },
  });

  if (!admin) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Update last login
  await admin.update({ lastLogin: new Date() });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(admin);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        lastLogin: admin.lastLogin,
      },
      accessToken,
      refreshToken,
    },
  });
});

// Refresh access token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find admin
    const admin = await Admin.findOne({
      where: { 
        id: decoded.id,
        isActive: true 
      },
    });

    if (!admin) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = generateTokens(admin);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
});

// Get current admin profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const admin = await Admin.findByPk(req.user!.id, {
    attributes: ['id', 'username', 'email', 'isActive', 'lastLogin', 'createdAt'],
  });

  res.json({
    success: true,
    data: admin,
  });
});