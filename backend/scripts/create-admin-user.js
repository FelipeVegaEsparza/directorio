const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  console.log('🔄 Connecting to database...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'radio_tv_directory'
    });

    console.log('✅ Connected.');

    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    const [rows] = await connection.execute('SELECT * FROM admins WHERE username = ?', ['admin']);

    if (rows.length > 0) {
      console.log('⚠️ Admin user already exists. Updating password...');
      await connection.execute(
        'UPDATE admins SET passwordHash = ?, isActive = 1 WHERE username = ?',
        [passwordHash, 'admin']
      );
      console.log('✅ Admin password updated to: admin123');
    } else {
      console.log('Creating admin user...');
      await connection.execute(
        'INSERT INTO admins (username, email, passwordHash, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        ['admin', 'admin@radiotvdirectory.com', passwordHash, 1]
      );
      console.log('✅ Admin user created successfully.');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
