import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Media, Category, SocialLink, Schedule } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';

// Get all media with filters and pagination
export const getMedia = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    category,
    country,
    type,
    featured,
    verified,
    sort = 'relevance',
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  
  // Build where conditions
  const whereConditions: any = {
    isActive: true,
  };

  if (search) {
    whereConditions[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { city: { [Op.like]: `%${search}%` } },
      { country: { [Op.like]: `%${search}%` } },
    ];
  }

  if (type) {
    whereConditions.type = type;
  }

  if (country) {
    whereConditions.country = { [Op.like]: `%${country}%` };
  }

  if (featured !== undefined) {
    whereConditions.isFeatured = featured === 'true';
  }

  if (verified !== undefined) {
    whereConditions.isVerified = verified === 'true';
  }

  // Category filter
  const includeConditions: any = [
    {
      model: Category,
      as: 'category',
      required: false,
    },
    {
      model: SocialLink,
      as: 'socialLinks',
      required: false,
    },
  ];

  if (category) {
    includeConditions[0].where = {
      [Op.or]: [
        { slug: category },
        { name: { [Op.like]: `%${category}%` } },
      ],
    };
    includeConditions[0].required = true;
  }

  // Build order conditions based on sort parameter
  let orderConditions: any[] = [];
  
  switch (sort) {
    case 'popular':
      orderConditions = [['viewCount', 'DESC'], ['playCount', 'DESC'], ['createdAt', 'DESC']];
      break;
    case 'recent':
      orderConditions = [['createdAt', 'DESC']];
      break;
    case 'name':
      orderConditions = [['name', 'ASC']];
      break;
    case 'views':
      orderConditions = [['viewCount', 'DESC'], ['createdAt', 'DESC']];
      break;
    case 'plays':
      orderConditions = [['playCount', 'DESC'], ['createdAt', 'DESC']];
      break;
    case 'relevance':
    default:
      orderConditions = [['isFeatured', 'DESC'], ['viewCount', 'DESC'], ['createdAt', 'DESC']];
      break;
  }

  const { count, rows } = await Media.findAndCountAll({
    where: whereConditions,
    include: includeConditions,
    limit: Number(limit),
    offset,
    order: orderConditions,
    distinct: true,
  });

  const totalPages = Math.ceil(count / Number(limit));

  res.json({
    success: true,
    data: rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count,
      totalPages,
    },
  });
});

// Get single media by ID or slug
export const getMediaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Try to find by UUID first, then by slug
  const whereCondition = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    ? { id }
    : { slug: id };

  const media = await Media.findOne({
    where: {
      ...whereCondition,
      isActive: true,
    },
    include: [
      {
        model: Category,
        as: 'category',
        required: false,
      },
      {
        model: SocialLink,
        as: 'socialLinks',
        required: false,
      },
      {
        model: Schedule,
        as: 'schedules',
        required: false,
        order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
      },
    ],
  });

  if (!media) {
    throw new NotFoundError('Media');
  }

  res.json({
    success: true,
    data: media,
  });
});

// Get featured media
export const getFeaturedMedia = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 6, type } = req.query;

  const whereConditions: any = {
    isActive: true,
    isFeatured: true,
  };

  if (type) {
    whereConditions.type = type;
  }

  const media = await Media.findAll({
    where: whereConditions,
    include: [
      {
        model: Category,
        as: 'category',
        required: false,
      },
      {
        model: SocialLink,
        as: 'socialLinks',
        required: false,
      },
    ],
    limit: Number(limit),
    order: [
      ['isFeatured', 'DESC'], // Featured first
      ['createdAt', 'DESC'],  // Then newest
      ['viewCount', 'DESC'],  // Then most viewed
    ],
  });

  res.json({
    success: true,
    data: media,
  });
});

// Get popular media
export const getPopularMedia = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 6, type } = req.query;

  const whereConditions: any = {
    isActive: true,
  };

  if (type) {
    whereConditions.type = type;
  }

  const media = await Media.findAll({
    where: whereConditions,
    include: [
      {
        model: Category,
        as: 'category',
        required: false,
      },
      {
        model: SocialLink,
        as: 'socialLinks',
        required: false,
      },
    ],
    limit: Number(limit),
    order: [
      ['playCount', 'DESC'],
      ['viewCount', 'DESC'],
    ],
  });

  res.json({
    success: true,
    data: media,
  });
});

// Get recent media
export const getRecentMedia = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 6, type } = req.query;

  const whereConditions: any = {
    isActive: true,
  };

  if (type) {
    whereConditions.type = type;
  }

  const media = await Media.findAll({
    where: whereConditions,
    include: [
      {
        model: Category,
        as: 'category',
        required: false,
      },
      {
        model: SocialLink,
        as: 'socialLinks',
        required: false,
      },
    ],
    limit: Number(limit),
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: media,
  });
});