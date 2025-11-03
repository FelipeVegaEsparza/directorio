import sequelize from '../config/database';
import Category from './Category';
import Media from './Media';
import SocialLink from './SocialLink';
import Schedule from './Schedule';
import Request from './Request';
import Admin from './Admin';
import Stats from './Stats';
import SiteConfig from './SiteConfig';

// Define associations
Media.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Media, { foreignKey: 'categoryId', as: 'media' });

Media.hasMany(SocialLink, { foreignKey: 'mediaId', as: 'socialLinks' });
SocialLink.belongsTo(Media, { foreignKey: 'mediaId', as: 'media' });

Media.hasMany(Schedule, { foreignKey: 'mediaId', as: 'schedules' });
Schedule.belongsTo(Media, { foreignKey: 'mediaId', as: 'media' });

Media.hasMany(Stats, { foreignKey: 'mediaId', as: 'stats' });
Stats.belongsTo(Media, { foreignKey: 'mediaId', as: 'media' });

// Export models
export {
  sequelize,
  Category,
  Media,
  SocialLink,
  Schedule,
  Request,
  Admin,
  Stats,
  SiteConfig,
};

// Export default object with all models
export default {
  sequelize,
  Category,
  Media,
  SocialLink,
  Schedule,
  Request,
  Admin,
  Stats,
  SiteConfig,
};