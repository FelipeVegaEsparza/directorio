import { Media, Category, SocialLink, Schedule } from '../../models';
import { v4 as uuidv4 } from 'uuid';

export async function seedSampleData() {
  try {
    console.log('🔄 Seeding sample media data...');

    // Get categories
    const musicCategory = await Category.findOne({ where: { slug: 'musica' } });
    const newsCategory = await Category.findOne({ where: { slug: 'noticias' } });
    const sportsCategory = await Category.findOne({ where: { slug: 'deportes' } });

    // Sample radio stations
    const sampleRadios = [
      {
        id: uuidv4(),
        name: 'Radio Música FM',
        slug: 'radio-musica-fm',
        type: 'radio' as const,
        description: 'La mejor música las 24 horas del día',
        streamUrl: 'https://example.com/stream/radio-musica-fm',
        logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
        country: 'Chile',
        city: 'Santiago',
        categoryId: musicCategory?.id,
        isFeatured: true,
        isVerified: true,
        viewCount: 1250,
        playCount: 890,
      },
      {
        id: uuidv4(),
        name: 'Noticias 24/7',
        slug: 'noticias-247',
        type: 'radio' as const,
        description: 'Información actualizada las 24 horas',
        streamUrl: 'https://example.com/stream/noticias-247',
        logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&crop=center',
        country: 'Chile',
        city: 'Valparaíso',
        categoryId: newsCategory?.id,
        isFeatured: true,
        isVerified: true,
        viewCount: 2100,
        playCount: 1450,
      },
      {
        id: uuidv4(),
        name: 'Deportes Radio',
        slug: 'deportes-radio',
        type: 'radio' as const,
        description: 'Todo el deporte nacional e internacional',
        streamUrl: 'https://example.com/stream/deportes-radio',
        logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop&crop=center',
        country: 'Chile',
        city: 'Concepción',
        categoryId: sportsCategory?.id,
        isVerified: true,
        viewCount: 850,
        playCount: 620,
      },
    ];

    // Sample TV channels
    const sampleTVs = [
      {
        id: uuidv4(),
        name: 'Canal Noticias TV',
        slug: 'canal-noticias-tv',
        type: 'tv' as const,
        description: 'Canal de televisión con noticias en vivo',
        streamUrl: 'https://example.com/stream/canal-noticias-tv',
        logoUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop&crop=center',
        country: 'Chile',
        city: 'Santiago',
        categoryId: newsCategory?.id,
        isFeatured: true,
        isVerified: true,
        viewCount: 3200,
        playCount: 2100,
      },
      {
        id: uuidv4(),
        name: 'Deportes TV',
        slug: 'deportes-tv',
        type: 'tv' as const,
        description: 'Transmisiones deportivas en vivo',
        streamUrl: 'https://example.com/stream/deportes-tv',
        logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop&crop=center',
        country: 'Chile',
        city: 'Santiago',
        categoryId: sportsCategory?.id,
        isFeatured: true,
        isVerified: true,
        viewCount: 4500,
        playCount: 3200,
      },
    ];

    // Create media entries
    const allMedia = [...sampleRadios, ...sampleTVs];
    for (const mediaData of allMedia) {
      const [media] = await Media.findOrCreate({
        where: { slug: mediaData.slug },
        defaults: mediaData,
      });

      // Add sample social links
      const socialLinks = [
        { platform: 'facebook', url: `https://facebook.com/${mediaData.slug}` },
        { platform: 'twitter', url: `https://twitter.com/${mediaData.slug}` },
        { platform: 'instagram', url: `https://instagram.com/${mediaData.slug}` },
      ];

      for (const socialData of socialLinks) {
        await SocialLink.findOrCreate({
          where: { 
            mediaId: media.id, 
            platform: socialData.platform 
          },
          defaults: {
            mediaId: media.id,
            ...socialData,
          },
        });
      }

      // Add sample schedule for some media
      if (mediaData.type === 'radio' && Math.random() > 0.5) {
        const schedules = [
          {
            dayOfWeek: 1, // Monday
            startTime: '06:00:00',
            endTime: '10:00:00',
            programName: 'Programa Matutino',
            description: 'El mejor programa para empezar el día',
          },
          {
            dayOfWeek: 1, // Monday
            startTime: '14:00:00',
            endTime: '18:00:00',
            programName: 'Tarde Musical',
            description: 'La mejor música para la tarde',
          },
        ];

        for (const scheduleData of schedules) {
          await Schedule.findOrCreate({
            where: {
              mediaId: media.id,
              dayOfWeek: scheduleData.dayOfWeek,
              startTime: scheduleData.startTime,
            },
            defaults: {
              mediaId: media.id,
              ...scheduleData,
            },
          });
        }
      }
    }

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  }
}

// Script execution
if (require.main === module) {
  seedSampleData()
    .then(() => {
      console.log('🎉 Sample data seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Sample data seeding failed:', error);
      process.exit(1);
    });
}