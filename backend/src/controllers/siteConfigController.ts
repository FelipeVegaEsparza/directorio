import { Request, Response } from 'express';
import { SiteConfig } from '../models';
import { asyncHandler } from '../middleware/errorHandler';

// Get site configuration
export const getSiteConfig = asyncHandler(async (req: Request, res: Response) => {
  let config = await SiteConfig.findOne();
  
  // If no config exists, create default one
  if (!config) {
    config = await SiteConfig.create({
      siteName: 'Radio TV Directory',
      siteDescription: 'Directorio de radios y canales de TV',
      primaryColor: '#3B82F6',
      secondaryColor: '#6B7280',
    });
  }

  res.json({
    success: true,
    data: config,
  });
});

// Update site configuration
export const updateSiteConfig = asyncHandler(async (req: Request, res: Response) => {
  const {
    siteName,
    siteDescription,
    logoUrl,
    faviconUrl,
    primaryColor,
    secondaryColor,
    showOnlyLogo,
  } = req.body;

  let config = await SiteConfig.findOne();
  
  if (!config) {
    // Create new config
    config = await SiteConfig.create({
      siteName,
      siteDescription,
      logoUrl,
      faviconUrl,
      primaryColor,
      secondaryColor,
      showOnlyLogo,
    });
  } else {
    // Update existing config
    await config.update({
      siteName,
      siteDescription,
      logoUrl,
      faviconUrl,
      primaryColor,
      secondaryColor,
      showOnlyLogo,
    });
  }

  res.json({
    success: true,
    message: 'Configuración actualizada exitosamente',
    data: config,
  });
});