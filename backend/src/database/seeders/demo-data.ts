import { Category, Media, Admin, Stats } from '../../models';
import bcrypt from 'bcrypt';

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...');

    // Create admin user
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        isActive: true,
      });
      console.log('✅ Admin user created (username: admin, password: admin123)');
    }

    // Create categories
    const categories = [
      { name: 'Música', slug: 'musica', description: 'Estaciones de música' },
      { name: 'Noticias', slug: 'noticias', description: 'Canales de noticias' },
      { name: 'Deportes', slug: 'deportes', description: 'Canales deportivos' },
      { name: 'Entretenimiento', slug: 'entretenimiento', description: 'Entretenimiento general' },
    ];

    for (const cat of categories) {
      const [category] = await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: cat,
      });
    }
    console.log('✅ Categories created');

    // Create sample media
    const sampleMedia = [
      {
        name: 'Radio Nacional',
        type: 'radio' as const,
        description: 'La radio nacional de Argentina',
        streamUrl: 'https://sa.mp3.icecast.magma.edge-access.net/sc_rad37',
        country: 'Argentina',
        city: 'Buenos Aires',
        isActive: true,
        isFeatured: true,
        isVerified: true,
        viewCount: 1250,
        playCount: 890,
      },
      {
        name: 'FM Rock',
        type: 'radio' as const,
        description: 'La mejor música rock',
        streamUrl: 'https://streaming.fmlatribu.com/radio.mp3',
        country: 'Argentina',
        city: 'Córdoba',
        isActive: true,
        isFeatured: false,
        isVerified: true,
        viewCount: 2100,
        playCount: 1450,
      },
      {
        name: 'Canal 13',
        type: 'tv' as const,
        description: 'Televisión argentina',
        streamUrl: 'https://live-01-02-eltrece.vodgc.net/eltrecetv/index.m3u8',
        country: 'Argentina',
        city: 'Buenos Aires',
        isActive: true,
        isFeatured: true,
        isVerified: true,
        viewCount: 3200,
        playCount: 2100,
      },
      {
        name: 'Radio Pop',
        type: 'radio' as const,
        description: 'Música pop las 24 horas',
        streamUrl: 'https://streaming.radiopop.com.ar/8000/stream',
        country: 'Argentina',
        city: 'Rosario',
        isActive: true,
        isFeatured: false,
        isVerified: false,
        viewCount: 850,
        playCount: 620,
      },
      {
        name: 'TV Pública',
        type: 'tv' as const,
        description: 'Televisión Pública Argentina',
        streamUrl: 'https://cntv.ar/live/c7eds/playlist.m3u8',
        country: 'Argentina',
        city: 'Buenos Aires',
        isActive: true,
        isFeatured: false,
        isVerified: true,
        viewCount: 1800,
        playCount: 1200,
      },
    ];

    const musicCategory = await Category.findOne({ where: { slug: 'musica' } });
    const newsCategory = await Category.findOne({ where: { slug: 'noticias' } });

    for (const [index, mediaData] of sampleMedia.entries()) {
      const [media] = await Media.findOrCreate({
        where: { name: mediaData.name },
        defaults: {
          ...mediaData,
          slug: generateSlug(mediaData.name),
          categoryId: index % 2 === 0 ? musicCategory?.id : newsCategory?.id,
        },
      });

      // Create some sample stats for each media
      const now = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Random views and plays for the last 30 days
        const viewsCount = Math.floor(Math.random() * 50) + 10;
        const playsCount = Math.floor(Math.random() * 30) + 5;

        for (let v = 0; v < viewsCount; v++) {
          await Stats.create({
            mediaId: media.id,
            eventType: 'view',
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Demo User Agent',
            createdAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          });
        }

        for (let p = 0; p < playsCount; p++) {
          await Stats.create({
            mediaId: media.id,
            eventType: 'play',
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Demo User Agent',
            createdAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          });
        }
      }
    }

    console.log('✅ Sample media and stats created');
    console.log('\n🎉 Demo data seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🌐 URLs:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Admin: http://localhost:3000/admin/login');
    console.log('   API: http://localhost:3001');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
}