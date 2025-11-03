import { Media } from '../../models';

export async function updateMediaImages() {
  try {
    console.log('🔄 Updating media images...');

    // Update existing media with image URLs
    const mediaUpdates = [
      {
        slug: 'radio-musica-fm',
        logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
      },
      {
        slug: 'noticias-247',
        logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&crop=center',
      },
      {
        slug: 'deportes-radio',
        logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop&crop=center',
      },
      {
        slug: 'canal-noticias-tv',
        logoUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop&crop=center',
      },
      {
        slug: 'deportes-tv',
        logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&crop=center',
        bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop&crop=center',
      },
    ];

    for (const update of mediaUpdates) {
      const media = await Media.findOne({ where: { slug: update.slug } });
      if (media) {
        await media.update({
          logoUrl: update.logoUrl,
          bannerUrl: update.bannerUrl,
        });
        console.log(`✅ Updated images for ${update.slug}`);
      } else {
        console.log(`⚠️ Media not found: ${update.slug}`);
      }
    }

    console.log('✅ Media images updated successfully');
  } catch (error) {
    console.error('❌ Error updating media images:', error);
    throw error;
  }
}

// Script execution
if (require.main === module) {
  updateMediaImages()
    .then(() => {
      console.log('🎉 Media images update completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Media images update failed:', error);
      process.exit(1);
    });
}