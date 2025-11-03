export interface Media {
  id: string;
  name: string;
  slug: string;
  type: 'radio' | 'tv';
  description?: string;
  streamUrl: string;
  logoUrl?: string;
  bannerUrl?: string;
  country?: string;
  city?: string;
  categoryId?: number;
  category?: Category;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  viewCount: number;
  playCount: number;
  socialLinks: SocialLink[];
  schedules: Schedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface SocialLink {
  id: number;
  mediaId: string;
  platform: string;
  url: string;
}

export interface Schedule {
  id: number;
  mediaId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  programName: string;
  description?: string;
}

export interface Request {
  id: number;
  name: string;
  email: string;
  mediaName: string;
  mediaType: 'radio' | 'tv';
  streamUrl: string;
  description?: string;
  country?: string;
  city?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  processedAt?: Date;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Stats {
  id: number;
  mediaId: string;
  eventType: 'view' | 'play';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface MediaCreateRequest {
  name: string;
  type: 'radio' | 'tv';
  description?: string;
  streamUrl: string;
  country?: string;
  city?: string;
  categoryId?: number;
  socialLinks?: Omit<SocialLink, 'id' | 'mediaId'>[];
}

export interface MediaUpdateRequest extends Partial<MediaCreateRequest> {
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
}

export interface JoinRequestData {
  name: string;
  email: string;
  mediaName: string;
  mediaType: 'radio' | 'tv';
  streamUrl: string;
  description?: string;
  country?: string;
  city?: string;
  website?: string;
}