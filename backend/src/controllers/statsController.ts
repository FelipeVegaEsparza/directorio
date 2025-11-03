import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Media, Stats } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';

// Record a view or play event
export const recordEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { eventType } = req.body;
  
  // Verify media exists and is active
  const media = await Media.findOne({
    where: { id, isActive: true },
  });

  if (!media) {
    throw new NotFoundError('Media');
  }

  // Get client info
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';

  // Create stats record
  await Stats.create({
    mediaId: id,
    eventType,
    ipAddress,
    userAgent,
  });

  // Update media counters
  if (eventType === 'view') {
    await media.increment('viewCount');
  } else if (eventType === 'play') {
    await media.increment('playCount');
  }

  res.json({
    success: true,
    message: `${eventType} recorded successfully`,
  });
});

// Get detailed analytics for a specific media
export const getMediaAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { period = '30' } = req.query; // days
  
  const media = await Media.findByPk(id);
  if (!media) {
    throw new NotFoundError('Media');
  }

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - Number(period));

  // Get stats for the period
  const [totalViews, totalPlays, recentViews, recentPlays] = await Promise.all([
    Stats.count({ where: { mediaId: id, eventType: 'view' } }),
    Stats.count({ where: { mediaId: id, eventType: 'play' } }),
    Stats.count({ 
      where: { 
        mediaId: id, 
        eventType: 'view',
        createdAt: { [Op.gte]: daysAgo }
      } 
    }),
    Stats.count({ 
      where: { 
        mediaId: id, 
        eventType: 'play',
        createdAt: { [Op.gte]: daysAgo }
      } 
    }),
  ]);

  // Daily breakdown for the period
  const dailyStats = await Stats.findAll({
    attributes: [
      [Stats.sequelize!.fn('DATE', Stats.sequelize!.col('createdAt')), 'date'],
      'eventType',
      [Stats.sequelize!.fn('COUNT', Stats.sequelize!.col('id')), 'count']
    ],
    where: {
      mediaId: id,
      createdAt: { [Op.gte]: daysAgo }
    },
    group: [
      Stats.sequelize!.fn('DATE', Stats.sequelize!.col('createdAt')),
      'eventType'
    ],
    order: [[Stats.sequelize!.fn('DATE', Stats.sequelize!.col('createdAt')), 'ASC']],
  });

  // Hourly breakdown for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const hourlyStats = await Stats.findAll({
    attributes: [
      [Stats.sequelize!.fn('HOUR', Stats.sequelize!.col('createdAt')), 'hour'],
      'eventType',
      [Stats.sequelize!.fn('COUNT', Stats.sequelize!.col('id')), 'count']
    ],
    where: {
      mediaId: id,
      createdAt: { [Op.gte]: today }
    },
    group: [
      Stats.sequelize!.fn('HOUR', Stats.sequelize!.col('createdAt')),
      'eventType'
    ],
    order: [[Stats.sequelize!.fn('HOUR', Stats.sequelize!.col('createdAt')), 'ASC']],
  });

  res.json({
    success: true,
    data: {
      media: {
        id: media.id,
        name: media.name,
        type: media.type,
      },
      totals: {
        views: totalViews,
        plays: totalPlays,
      },
      period: {
        days: Number(period),
        views: recentViews,
        plays: recentPlays,
      },
      daily: dailyStats,
      hourly: hourlyStats,
    },
  });
});

// Get top performing media
export const getTopMedia = asyncHandler(async (req: Request, res: Response) => {
  const { period = '30', limit = '10', type } = req.query;
  
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - Number(period));

  const whereClause: any = { isActive: true };
  if (type && (type === 'radio' || type === 'tv')) {
    whereClause.type = type;
  }

  // Get media with their stats
  const topByViews = await Media.findAll({
    attributes: [
      'id', 'name', 'type', 'country', 'logoUrl',
      [Media.sequelize!.fn('COUNT', Media.sequelize!.col('stats.id')), 'recentViews']
    ],
    include: [{
      model: Stats,
      as: 'stats',
      where: {
        eventType: 'view',
        createdAt: { [Op.gte]: daysAgo }
      },
      attributes: [],
      required: false,
    }],
    where: whereClause,
    group: ['Media.id'],
    order: [[Media.sequelize!.literal('recentViews'), 'DESC']],
    limit: Number(limit),
  });

  const topByPlays = await Media.findAll({
    attributes: [
      'id', 'name', 'type', 'country', 'logoUrl',
      [Media.sequelize!.fn('COUNT', Media.sequelize!.col('stats.id')), 'recentPlays']
    ],
    include: [{
      model: Stats,
      as: 'stats',
      where: {
        eventType: 'play',
        createdAt: { [Op.gte]: daysAgo }
      },
      attributes: [],
      required: false,
    }],
    where: whereClause,
    group: ['Media.id'],
    order: [[Media.sequelize!.literal('recentPlays'), 'DESC']],
    limit: Number(limit),
  });

  res.json({
    success: true,
    data: {
      period: Number(period),
      topByViews,
      topByPlays,
    },
  });
});

// Get real-time statistics
export const getRealTimeStats = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    lastHourViews,
    lastHourPlays,
    last24HourViews,
    last24HourPlays,
    activeStreams,
  ] = await Promise.all([
    Stats.count({
      where: {
        eventType: 'view',
        createdAt: { [Op.gte]: oneHourAgo }
      }
    }),
    Stats.count({
      where: {
        eventType: 'play',
        createdAt: { [Op.gte]: oneHourAgo }
      }
    }),
    Stats.count({
      where: {
        eventType: 'view',
        createdAt: { [Op.gte]: oneDayAgo }
      }
    }),
    Stats.count({
      where: {
        eventType: 'play',
        createdAt: { [Op.gte]: oneDayAgo }
      }
    }),
    // Estimate active streams based on recent plays
    Stats.count({
      attributes: [[Stats.sequelize!.fn('DISTINCT', Stats.sequelize!.col('mediaId')), 'uniqueMedia']],
      where: {
        eventType: 'play',
        createdAt: { [Op.gte]: oneHourAgo }
      }
    }),
  ]);

  res.json({
    success: true,
    data: {
      lastHour: {
        views: lastHourViews,
        plays: lastHourPlays,
      },
      last24Hours: {
        views: last24HourViews,
        plays: last24HourPlays,
      },
      activeStreams,
      timestamp: now.toISOString(),
    },
  });
});

// Get overview stats for homepage
export const getOverviewStats = asyncHandler(async (req: Request, res: Response) => {
  // Get total radios
  const totalRadios = await Media.count({
    where: {
      type: 'radio',
      isActive: true
    }
  });

  // Get total TV channels
  const totalTV = await Media.count({
    where: {
      type: 'tv',
      isActive: true
    }
  });

  // Get total countries
  const allMedia = await Media.findAll({
    attributes: ['country'],
    where: {
      isActive: true
    }
  });

  const countries = new Set(
    allMedia
      .map(media => media.country)
      .filter(country => country && country.trim() !== '')
  );
  const totalCountries = countries.size;

  // Get total plays and views
  const totalPlays = await Media.sum('playCount') || 0;
  const totalViews = await Media.sum('viewCount') || 0;

  res.json({
    success: true,
    data: {
      totalRadios,
      totalTV,
      totalCountries,
      totalPlays: Math.floor(totalPlays),
      totalViews: Math.floor(totalViews)
    }
  });
});