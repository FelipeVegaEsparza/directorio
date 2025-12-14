import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'radio_tv_directory',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
});

export default sequelize;