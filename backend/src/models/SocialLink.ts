import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SocialLinkAttributes {
  id: number;
  mediaId: string;
  platform: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SocialLinkCreationAttributes extends Optional<SocialLinkAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SocialLink extends Model<SocialLinkAttributes, SocialLinkCreationAttributes> implements SocialLinkAttributes {
  public id!: number;
  public mediaId!: string;
  public platform!: string;
  public url!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SocialLink.init(
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
    platform: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
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
    tableName: 'social_links',
    timestamps: true,
  }
);

export default SocialLink;