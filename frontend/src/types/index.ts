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

// Media types
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
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
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

// Request types
export interface JoinRequest {
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
  createdAt: string;
  processedAt?: string;
}

// Form types
export interface JoinRequestForm {
  name: string;
  email: string;
  mediaName: string;
  mediaType: 'radio' | 'tv';
  streamUrl: string;
  description?: string;
  country?: string;
  city?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface MediaFilters {
  search?: string;
  category?: string;
  country?: string;
  type?: 'radio' | 'tv';
  featured?: boolean;
  verified?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

// Admin types
export interface Admin {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Admin;
  accessToken: string;
  refreshToken: string;
}

// Dashboard types
export interface DashboardStats {
  overview: {
    totalMedia: number;
    activeMedia: number;
    inactiveMedia: number;
    featuredMedia: number;
    verifiedMedia: number;
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    totalViews: number;
    totalPlays: number;
    recentViews: number;
    recentPlays: number;
  };
  topMedia: {
    byViews: Media[];
    byPlays: Media[];
  };
  distribution: {
    byCategory: Array<{ id: number; name: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
  };
  activity: {
    daily: Array<{
      date: string;
      eventType: 'view' | 'play';
      count: number;
    }>;
    hourly: Array<{
      hour: number;
      eventType: 'view' | 'play';
      count: number;
    }>;
  };
  growth: {
    views: {
      current: number;
      previous: number;
      percentage: number;
    };
    plays: {
      current: number;
      previous: number;
      percentage: number;
    };
  };
  period: number;
}

// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'url' | 'search';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'soft' | 'medium' | 'large';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Player types
export interface PlayerState {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error?: string;
}

export interface PlayerProps {
  media: Media;
  autoplay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: string) => void;
}