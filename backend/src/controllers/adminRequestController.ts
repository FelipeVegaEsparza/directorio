import { Request as ExpressRequest, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Request as RequestModel, Media, SocialLink } from '../models';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';

// Get all requests
export const getAllRequests = asyncHandler(async (req: ExpressRequest, res: Response) => {
  console.log('getAllRequests called with query:', req.query);
  
  const {
    page = 1,
    limit = 10,
    status = 'pending',
    search = '',
  } = req.query;

  console.log('Parsed parameters:', { page, limit, status, search });

  const offset = (Number(page) - 1) * Number(limit);
  
  const whereConditions: any = {};

  if (status && status !== 'all') {
    whereConditions.status = status;
  }

  if (search) {
    whereConditions[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { mediaName: { [Op.like]: `%${search}%` } },
    ];
  }

  console.log('Where conditions:', whereConditions);

  const { count, rows } = await RequestModel.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  console.log('Query results:', { count, rowsLength: rows.length });

  const totalPages = Math.ceil(count / Number(limit));

  const response = {
    success: true,
    data: {
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages,
      },
    },
  };

  console.log('Sending response:', response);

  res.json(response);
});

// Get single request
export const getRequestById = asyncHandler(async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;

  const request = await RequestModel.findByPk(id);
  if (!request) {
    throw new NotFoundError('Request');
  }

  res.json({
    success: true,
    data: request,
  });
});

// Update request status (approve or reject)
export const updateRequestStatus = asyncHandler(async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const request = await RequestModel.findByPk(id);
  if (!request) {
    throw new NotFoundError('Request');
  }

  if (request.status !== 'pending') {
    throw new BadRequestError('Request has already been processed');
  }

  if (status === 'approved') {
    return approveRequestLogic(request, res);
  } else if (status === 'rejected') {
    return rejectRequestLogic(request, reason, res);
  } else {
    throw new BadRequestError('Invalid status. Must be "approved" or "rejected"');
  }
});

// Approve request and create media
export const approveRequest = asyncHandler(async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;

  const request = await RequestModel.findByPk(id);
  if (!request) {
    throw new NotFoundError('Request');
  }

  if (request.status !== 'pending') {
    throw new BadRequestError('Request has already been processed');
  }

  return approveRequestLogic(request, res);
});

const approveRequestLogic = async (request: any, res: Response) => {

  // Generate slug from media name
  const slug = request.mediaName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Check if slug already exists
  let finalSlug = slug;
  let counter = 1;
  while (await Media.findOne({ where: { slug: finalSlug } })) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  // Create media from request
  const media = await Media.create({
    id: uuidv4(),
    name: request.mediaName,
    slug: finalSlug,
    type: request.mediaType,
    description: request.description,
    streamUrl: request.streamUrl,
    country: request.country,
    city: request.city,
    isActive: true,
    isFeatured: false,
    isVerified: false,
  });

  // Create social links if provided
  const socialLinks = [];
  
  if (request.website) {
    socialLinks.push({
      mediaId: media.id,
      platform: 'website',
      url: request.website,
    });
  }
  
  if (request.facebook) {
    socialLinks.push({
      mediaId: media.id,
      platform: 'facebook',
      url: request.facebook,
    });
  }
  
  if (request.instagram) {
    socialLinks.push({
      mediaId: media.id,
      platform: 'instagram',
      url: request.instagram,
    });
  }
  
  if (request.twitter) {
    socialLinks.push({
      mediaId: media.id,
      platform: 'twitter',
      url: request.twitter,
    });
  }
  
  if (request.youtube) {
    socialLinks.push({
      mediaId: media.id,
      platform: 'youtube',
      url: request.youtube,
    });
  }

  // Bulk create social links
  if (socialLinks.length > 0) {
    await SocialLink.bulkCreate(socialLinks);
  }

  // Update request status
  await request.update({
    status: 'approved',
    processedAt: new Date(),
  });

  res.json({
    success: true,
    message: 'Request approved and media created successfully',
    data: {
      request,
      media,
    },
  });
};

// Reject request
export const rejectRequest = asyncHandler(async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const request = await RequestModel.findByPk(id);
  if (!request) {
    throw new NotFoundError('Request');
  }

  if (request.status !== 'pending') {
    throw new BadRequestError('Request has already been processed');
  }

  return rejectRequestLogic(request, reason, res);
});

const rejectRequestLogic = async (request: any, reason: string | undefined, res: Response) => {
  // Update request status
  await request.update({
    status: 'rejected',
    processedAt: new Date(),
    // Store rejection reason in description field or add a new field
    description: reason ? `${request.description || ''}\n\nRejection reason: ${reason}` : request.description,
  });

  res.json({
    success: true,
    message: 'Request rejected successfully',
    data: request,
  });
};

// Delete request
export const deleteRequest = asyncHandler(async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;

  const request = await RequestModel.findByPk(id);
  if (!request) {
    throw new NotFoundError('Request');
  }

  await request.destroy();

  res.json({
    success: true,
    message: 'Request deleted successfully',
  });
});