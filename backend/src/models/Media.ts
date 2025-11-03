import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MediaAttributes {
  id: string;
  name: string;
  slug: string;
  type: 'radio' | 'tv';
  description?: string;
  streamUrl: string;
  logoUrl?: string;
  bannerUrl?: string;
  country?: string;
  city?: string;
  categoryId?: number;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  viewCount: number;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MediaCreationAttributes extends Optional<MediaAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isFeatured' | 'isVerified' | 'viewCount' | 'playCount'> {}

class Media extends Model<MediaAttributes, MediaCreationAttributes> implements MediaAttributes {
  public id!: string;
  public name!: string;
  public slug!: string;
  public type!: 'radio' | 'tv';
  public description?: string;
  public streamUrl!: string;
  public logoUrl?: string;
  public bannerUrl?: string;
  public country?: string;
  public city?: string;
  public categoryId?: number;
  public isActive!: boolean;
  public isFeatured!: boolean;
  public isVerified!: boolean;
  public viewCount!: number;
  public playCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Media.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('radio', 'tv'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    streamUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bannerUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    playCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'media',
    timestamps: true,
  }
);

export default Media;