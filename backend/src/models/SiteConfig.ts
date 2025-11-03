import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SiteConfigAttributes {
  id: number;
  siteName: string;
  siteDescription?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showOnlyLogo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SiteConfigCreationAttributes extends Optional<SiteConfigAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SiteConfig extends Model<SiteConfigAttributes, SiteConfigCreationAttributes> implements SiteConfigAttributes {
  public id!: number;
  public siteName!: string;
  public siteDescription?: string;
  public logoUrl?: string;
  public faviconUrl?: string;
  public primaryColor?: string;
  public secondaryColor?: string;
  public showOnlyLogo?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SiteConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    siteName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Radio TV Directory',
    },
    siteDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    faviconUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    primaryColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#3B82F6',
    },
    secondaryColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#6B7280',
    },
    showOnlyLogo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    tableName: 'site_config',
    timestamps: true,
  }
);

export default SiteConfig;