import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RequestAttributes {
  id: number;
  name: string;
  email: string;
  mediaName: string;
  mediaType: 'radio' | 'tv';
  streamUrl: string;
  description?: string;
  country?: string;
  city?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}

interface RequestCreationAttributes extends Optional<RequestAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'processedAt'> {}

class Request extends Model<RequestAttributes, RequestCreationAttributes> implements RequestAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public mediaName!: string;
  public mediaType!: 'radio' | 'tv';
  public streamUrl!: string;
  public description?: string;
  public country?: string;
  public city?: string;
  public website?: string;
  public facebook?: string;
  public instagram?: string;
  public twitter?: string;
  public youtube?: string;
  public status!: 'pending' | 'approved' | 'rejected';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public processedAt?: Date;
}

Request.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    mediaName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM('radio', 'tv'),
      allowNull: false,
    },
    streamUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    facebook: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    youtube: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'requests',
    timestamps: true,
  }
);

export default Request;