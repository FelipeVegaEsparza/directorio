import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Media, Category, SocialLink, Schedule } from '../models';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';

// Get all media (admin view - includes inactive)
export const getAllMedia = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    category,
    type,
    status,
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  
  const whereConditions: any = {};

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

  if (status === 'active') {
    whereConditions.isActive = true;
  } else if (status === 'inactive') {
    whereConditions.isActive = false;
  }

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

  const { count, rows } = await Media.findAndCountAll({
    where: whereConditions,
    include: includeConditions,
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
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

// Create new media
export const createMedia = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    type,
    description,
    streamUrl,
    logoUrl,
    bannerUrl,
    country,
    city,
    categoryId,
    isActive = true,
    isFeatured = false,
    isVerified = false,
    socialLinks = [],
  } = req.body;

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Check if slug already exists
  const existingMedia = await Media.findOne({ where: { slug } });
  if (existingMedia) {
    throw new BadRequestError('A media with similar name already exists');
  }

  // Create media
  const media = await Media.create({
    id: uuidv4(),
    name,
    slug,
    type,
    description,
    streamUrl,
    logoUrl,
    bannerUrl,
    country,
    city,
    categoryId,
    isActive,
    isFeatured,
    isVerified,
  });

  // Create social links if provided
  if (socialLinks.length > 0) {
    const socialLinkData = socialLinks.map((link: any) => ({
      mediaId: media.id,
      platform: link.platform,
      url: link.url,
    }));
    await SocialLink.bulkCreate(socialLinkData);
  }

  // Fetch complete media with relations
  const completeMedia = await Media.findByPk(media.id, {
    include: [
      { model: Category, as: 'category' },
      { model: SocialLink, as: 'socialLinks' },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Media created successfully',
    data: completeMedia,
  });
});

// Update media
export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { socialLinks, ...updateData } = req.body;

  const media = await Media.findByPk(id);
  if (!media) {
    throw new NotFoundError('Media');
  }

  // If name is being updated, update slug too
  if (updateData.name && updateData.name !== media.name) {
    const newSlug = updateData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check if new slug already exists
    const existingMedia = await Media.findOne({ 
      where: { 
        slug: newSlug,
        id: { [Op.ne]: id }
      } 
    });
    
    if (existingMedia) {
      throw new BadRequestError('A media with similar name already exists');
    }
    
    updateData.slug = newSlug;
  }

  await media.update(updateData);

  // Update social links if provided
  if (socialLinks !== undefined) {
    // Delete existing social links
    await SocialLink.destroy({ where: { mediaId: id } });
    
    // Create new social links
    if (socialLinks.length > 0) {
      const socialLinkData = socialLinks.map((link: any) => ({
        mediaId: id,
        platform: link.platform,
        url: link.url,
      }));
      await SocialLink.bulkCreate(socialLinkData);
    }
  }

  // Fetch updated media with relations
  const updatedMedia = await Media.findByPk(id, {
    include: [
      { model: Category, as: 'category' },
      { model: SocialLink, as: 'socialLinks' },
    ],
  });

  res.json({
    success: true,
    message: 'Media updated successfully',
    data: updatedMedia,
  });
});

// Delete media
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const media = await Media.findByPk(id);
  if (!media) {
    throw new NotFoundError('Media');
  }

  await media.destroy();

  res.json({
    success: true,
    message: 'Media deleted successfully',
  });
});

// Toggle media status (active/inactive)
export const toggleMediaStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const media = await Media.findByPk(id);
  if (!media) {
    throw new NotFoundError('Media');
  }

  await media.update({ isActive: !media.isActive });

  res.json({
    success: true,
    message: `Media ${media.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { isActive: media.isActive },
  });
});

// Toggle featured status
export const toggleFeaturedStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const media = await Media.findByPk(id);
  if (!media) {
    throw new NotFoundError('Media');
  }

  await media.update({ isFeatured: !media.isFeatured });

  res.json({
    success: true,
    message: `Media ${media.isFeatured ? 'featured' : 'unfeatured'} successfully`,
    data: { isFeatured: media.isFeatured },
  });
});

// Toggle verified status
export const toggleVerifiedStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const media = await Media.findByPk(id);
  if (!media) {
    throw new NotFoundError('Media');
  }

  await media.update({ isVerified: !media.isVerified });

  res.json({
    success: true,
    message: `Media ${media.isVerified ? 'verified' : 'unverified'} successfully`,
    data: { isVerified: media.isVerified },
  });
});