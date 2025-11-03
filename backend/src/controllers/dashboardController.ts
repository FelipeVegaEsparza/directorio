import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Media, Request as RequestModel, Stats, Category } from '../models';
import { asyncHandler } from '../middleware/errorHandler';

// Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log('📊 Getting dashboard stats...');
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));

  // Basic counts
  const [
    totalMedia,
    activeMedia,
    inactiveMedia,
    featuredMedia,
    verifiedMedia,
    totalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    totalViews,
    totalPlays,
    recentViews,
    recentPlays,
  ] = await Promise.all([
    // Media stats
    Media.count(),
    Media.count({ where: { isActive: true } }),
    Media.count({ where: { isActive: false } }),
    Media.count({ where: { isFeatured: true } }),
    Media.count({ where: { isVerified: true } }),
    
    // Request stats
    RequestModel.count(),
    RequestModel.count({ where: { status: 'pending' } }),
    RequestModel.count({ where: { status: 'approved' } }),
    RequestModel.count({ where: { status: 'rejected' } }),
    
    // Stats totals
    Stats.count({ where: { eventType: 'view' } }),
    Stats.count({ where: { eventType: 'play' } }),
    Stats.count({ 
      where: { 
        eventType: 'view',
        createdAt: { [Op.gte]: daysAgo }
      } 
    }),
    Stats.count({ 
      where: { 
        eventType: 'play',
        createdAt: { [Op.gte]: daysAgo }
      } 
    }),
  ]);

  // Top media by views
  const topMediaByViews = await Media.findAll({
    where: { isActive: true },
    attributes: ['id', 'name', 'type', 'viewCount', 'playCount'],
    order: [['viewCount', 'DESC']],
    limit: 5,
  });

  // Top media by plays
  const topMediaByPlays = await Media.findAll({
    where: { isActive: true },
    attributes: ['id', 'name', 'type', 'viewCount', 'playCount'],
    order: [['playCount', 'DESC']],
    limit: 5,
  });

  // Media by category (simplified)
  const categories = await Category.findAll({
    attributes: ['id', 'name'],
  });
  
  const mediaByCategory = await Promise.all(
    categories.map(async (cat) => ({
      id: cat.id,
      name: cat.name,
      count: await Media.count({ where: { categoryId: cat.id, isActive: true } })
    }))
  ).then(results => results.sort((a, b) => b.count - a.count));

  // Media by type (simplified)
  const radioCount = await Media.count({ where: { isActive: true, type: 'radio' } });
  const tvCount = await Media.count({ where: { isActive: true, type: 'tv' } });
  const mediaByType = [
    { type: 'radio', count: radioCount },
    { type: 'tv', count: tvCount }
  ];

  // Recent activity (simplified - just get counts for now)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const recentActivity: any[] = []; // Simplified for now

  // Hourly activity (simplified - just get counts for now)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayActivity: any[] = []; // Simplified for now

  // Growth metrics (compare with previous period)
  const previousPeriodStart = new Date(daysAgo);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - Number(period));

  const [previousViews, previousPlays] = await Promise.all([
    Stats.count({
      where: {
        eventType: 'view',
        createdAt: {
          [Op.gte]: previousPeriodStart,
          [Op.lt]: daysAgo
        }
      }
    }),
    Stats.count({
      where: {
        eventType: 'play',
        createdAt: {
          [Op.gte]: previousPeriodStart,
          [Op.lt]: daysAgo
        }
      }
    }),
  ]);

  // Calculate growth percentages
  const viewsGrowth = previousViews > 0 ? ((recentViews - previousViews) / previousViews) * 100 : 0;
  const playsGrowth = previousPlays > 0 ? ((recentPlays - previousPlays) / previousPlays) * 100 : 0;

  res.json({
    success: true,
    data: {
      overview: {
        totalMedia,
        activeMedia,
        inactiveMedia,
        featuredMedia,
        verifiedMedia,
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalViews,
        totalPlays,
        recentViews,
        recentPlays,
      },
      topMedia: {
        byViews: topMediaByViews,
        byPlays: topMediaByPlays,
      },
      distribution: {
        byCategory: mediaByCategory,
        byType: mediaByType,
      },
      activity: {
        daily: recentActivity,
        hourly: todayActivity,
      },
      growth: {
        views: {
          current: recentViews,
          previous: previousViews,
          percentage: viewsGrowth,
        },
        plays: {
          current: recentPlays,
          previous: previousPlays,
          percentage: playsGrowth,
        },
      },
      period: Number(period),
    },
  });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    throw error;
  }
});