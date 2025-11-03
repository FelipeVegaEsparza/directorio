import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Category, Media } from '../models';
import { asyncHandler } from '../middleware/errorHandler';

// Get all categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { includeCount = false } = req.query;

  const includeOptions = [];
  
  if (includeCount === 'true') {
    includeOptions.push({
      model: Media,
      as: 'media',
      where: { isActive: true },
      attributes: [],
      required: false,
    });
  }

  const categories = await Category.findAll({
    include: includeOptions,
    order: [['name', 'ASC']],
    ...(includeCount === 'true' && {
      attributes: {
        include: [
          [
            Category.sequelize!.fn('COUNT', Category.sequelize!.col('media.id')),
            'mediaCount'
          ]
        ]
      },
      group: ['Category.id'],
    }),
  });

  res.json({
    success: true,
    data: categories,
  });
});

// Get countries list
export const getCountries = asyncHandler(async (req: Request, res: Response) => {
  const allMedia = await Media.findAll({
    attributes: ['country'],
    where: {
      isActive: true,
    },
  });

  // Filter and deduplicate countries
  const countrySet = new Set<string>();
  allMedia.forEach(media => {
    if (media.country && media.country.trim() !== '') {
      countrySet.add(media.country.trim());
    }
  });

  const countryList = Array.from(countrySet).sort();

  res.json({
    success: true,
    data: countryList,
  });
});