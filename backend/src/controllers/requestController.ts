import { Request as ExpressRequest, Response } from 'express';
import { Op } from 'sequelize';
import { Request as RequestModel } from '../models';
import { asyncHandler, BadRequestError } from '../middleware/errorHandler';

// Submit a join request
export const submitJoinRequest = asyncHandler(async (req: ExpressRequest, res: Response) => {
  const {
    name,
    email,
    mediaName,
    mediaType,
    streamUrl,
    description,
    country,
    city,
    website,
    facebook,
    instagram,
    twitter,
    youtube,
  } = req.body;

  // Check if there's already a pending request with the same email or stream URL
  const existingRequest = await RequestModel.findOne({
    where: {
      status: 'pending',
      [Op.or]: [
        { email },
        { streamUrl },
      ],
    },
  });

  if (existingRequest) {
    throw new BadRequestError(
      'A pending request already exists with this email or stream URL'
    );
  }

  // Create the request
  const joinRequest = await RequestModel.create({
    name,
    email,
    mediaName,
    mediaType,
    streamUrl,
    description,
    country,
    city,
    website,
    facebook,
    instagram,
    twitter,
    youtube,
    status: 'pending',
  });

  // TODO: Send email notification to admin (optional)
  // await sendNewRequestNotification(joinRequest);

  res.status(201).json({
    success: true,
    message: 'Join request submitted successfully',
    data: {
      id: joinRequest.id,
      mediaName: joinRequest.mediaName,
      status: joinRequest.status,
      submittedAt: joinRequest.createdAt,
    },
  });
});

// Get request status (public endpoint for applicants to check)
export const getRequestStatus = asyncHandler(async (req: ExpressRequest, res: Response): Promise<void> => {
  const { email, streamUrl } = req.query;

  if (!email && !streamUrl) {
    throw new BadRequestError('Email or stream URL is required');
  }

  const whereCondition: any = {};
  if (email) whereCondition.email = email;
  if (streamUrl) whereCondition.streamUrl = streamUrl;

  const request = await RequestModel.findOne({
    where: whereCondition,
    attributes: ['id', 'mediaName', 'status', 'createdAt', 'processedAt'],
    order: [['createdAt', 'DESC']],
  });

  if (!request) {
    res.json({
      success: true,
      message: 'No request found',
      data: null,
    });
    return;
  }

  res.json({
    success: true,
    data: request,
  });
});