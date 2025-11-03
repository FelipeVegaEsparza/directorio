const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateSocialMedia() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'radio_tv_directory'
  });

  try {
    console.log('🔄 Adding social media fields to requests table...');
    
    // Check if columns already exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'requests' AND COLUMN_NAME IN ('facebook', 'instagram', 'twitter', 'youtube')
    `, [process.env.DB_NAME || 'radio_tv_directory']);
    
    if (columns.length === 0) {
      // Add the columns
      await connection.execute(`
        ALTER TABLE requests 
        ADD COLUMN facebook VARCHAR(500) NULL,
        ADD COLUMN instagram VARCHAR(500) NULL,
        ADD COLUMN twitter VARCHAR(500) NULL,
        ADD COLUMN youtube VARCHAR(500) NULL
      `);
      console.log('✅ Social media fields added successfully');
    } else {
      console.log('✅ Social media fields already exist');
    }
    
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrateSocialMedia();