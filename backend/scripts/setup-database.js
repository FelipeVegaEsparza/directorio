const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // Crear la base de datos si no existe
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'radio_tv_directory'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Base de datos '${process.env.DB_NAME || 'radio_tv_directory'}' creada o ya existe`);
    
    // Cerrar la conexión inicial
    await connection.end();
    
    // Crear nueva conexión con la base de datos específica para verificar
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'radio_tv_directory'
    });
    
    // Verificar la conexión
    await dbConnection.execute('SELECT 1');
    console.log('✅ Conexión a la base de datos exitosa');
    await dbConnection.end();
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error.message);
    process.exit(1);
  }
}

setupDatabase();