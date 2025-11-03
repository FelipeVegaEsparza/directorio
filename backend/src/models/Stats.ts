import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StatsAttributes {
  id: number;
  mediaId: string;
  eventType: 'view' | 'play';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StatsCreationAttributes extends Optional<StatsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Stats extends Model<StatsAttributes, StatsCreationAttributes> implements StatsAttributes {
  public id!: number;
  public mediaId!: string;
  public eventType!: 'view' | 'play';
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Stats.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mediaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    eventType: {
      type: DataTypes.ENUM('view', 'play'),
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
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
    tableName: 'stats',
    timestamps: true,
  }
);

export default Stats;