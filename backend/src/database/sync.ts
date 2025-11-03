import { sequelize, Category, Media, SocialLink, Schedule, Request, Admin, Stats } from '../models';
import bcrypt from 'bcryptjs';

export async function syncDatabase(force: boolean = false) {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    console.log('🔄 Synchronizing database models...');
    await sequelize.sync({ force });
    console.log('✅ Database models synchronized successfully.');

    if (force) {
      console.log('🔄 Seeding database with initial data...');
      await seedDatabase();
      console.log('✅ Database seeded successfully.');
    }

    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
}

export async function seedDatabase() {
  try {
    // Seed categories
    const categories = [
      { name: 'Música', slug: 'musica', description: 'Estaciones de música variada' },
      { name: 'Noticias', slug: 'noticias', description: 'Canales de noticias y actualidad' },
      { name: 'Deportes', slug: 'deportes', description: 'Contenido deportivo' },
      { name: 'Cristiana', slug: 'cristiana', description: 'Contenido religioso cristiano' },
      { name: 'Talk Show', slug: 'talk-show', description: 'Programas de conversación' },
      { name: 'Entretenimiento', slug: 'entretenimiento', description: 'Contenido de entretenimiento general' },
      { name: 'Educativa', slug: 'educativa', description: 'Contenido educativo y cultural' },
      { name: 'Regional', slug: 'regional', description: 'Contenido local y regional' },
    ];

    for (const categoryData of categories) {
      await Category.findOrCreate({
        where: { slug: categoryData.slug },
        defaults: categoryData,
      });
    }

    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await Admin.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@radiotvdirectory.com',
        passwordHash: adminPassword,
        isActive: true,
      },
    });

    console.log('📊 Seeded categories and default admin user');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Script execution
if (require.main === module) {
  const force = process.argv.includes('--force');
  
  syncDatabase(force)
    .then(() => {
      console.log('🎉 Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}