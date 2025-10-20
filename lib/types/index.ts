// Shared types and interfaces for the Taman Kehati application

// Re-export database types
export type {
  User,
  NewUser,
  Park,
  NewPark,
  BiodiversityIndex,
  NewBiodiversityIndex,
  BiodiversityTrend,
  NewBiodiversityTrend,
  BiodiversityComparison,
  NewBiodiversityComparison,
  Announcement,
  NewAnnouncement,
  AnnouncementAttachment,
  NewAnnouncementAttachment,
  AnnouncementStatus as UserAnnouncementStatus,
  NewAnnouncementStatus,
  Article,
  NewArticle,
  ArticleComment,
  NewArticleComment,
  ArticleLike,
  NewArticleLike,
  ArticleShare,
  NewArticleShare,
  AuditLog,
  NewAuditLog,
  AuditLogSummary,
  NewAuditLogSummary,
  Flora,
  NewFlora,
  Fauna,
  NewFauna
} from "~/db/schema";

// Common interfaces
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  province?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
}

// User and auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'REGIONAL_ADMIN';
  regionId?: string;
  avatar?: string;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  regionId?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Map and geospatial types
export interface MapFeature {
  id: string;
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: ParkProperties;
}

export interface ParkProperties {
  id: string;
  name: string;
  slug: string;
  province: string;
  regency: string;
  area: number; // hectares
  biodiversityScore?: number;
  status: string;
  createdAt: Date;
  lastUpdated: Date;
  fillColor: string;
  strokeColor: string;
  fillOpacity: number;
  strokeOpacity: number;
  totalFlora: number;
  totalFauna: number;
  totalActivities: number;
  centroid: [number, number]; // [longitude, latitude]
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
  pitch?: number;
  bearing?: number;
}

export interface MapFilter {
  provinces: string[];
  biodiversityRange: [number, number];
  areaRange: [number, number];
  status: string[];
  hasFlora: boolean;
  hasFauna: boolean;
  hasActivities: boolean;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | undefined;
  };
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

// Dashboard and stats types
export interface DashboardStats {
  totalParks: number;
  approvedParks: number;
  pendingParks: number;
  totalFlora: number;
  totalFauna: number;
  averageBiodiversityScore: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  entity: string;
  entityName: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

// Search and filtering
export interface SearchSuggestion {
  id: string;
  type: 'park' | 'flora' | 'fauna' | 'article';
  title: string;
  subtitle?: string;
  url: string;
  highlighted?: string;
}

export interface FilterTag {
  key: string;
  value: string;
  label: string;
  removable?: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface SystemAlert {
  id: string;
  type: 'maintenance' | 'update' | 'security' | 'feature';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  targetRoles?: string[];
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Export commonly used enums
export const PARK_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  REGIONAL_ADMIN: 'REGIONAL_ADMIN'
} as const;

export const ARTICLE_CATEGORIES = {
  NEWS: 'NEWS',
  CONSERVATION: 'CONSERVATION',
  RESEARCH: 'RESEARCH',
  EDUCATION: 'EDUCATION',
  EVENT: 'EVENT',
  SUCCESS_STORY: 'SUCCESS_STORY',
  POLICY: 'POLICY',
  TECHNOLOGY: 'TECHNOLOGY',
  COMMUNITY: 'COMMUNITY'
} as const;

export const ANNOUNCEMENT_CATEGORIES = {
  SYSTEM: 'SYSTEM',
  POLICY: 'POLICY',
  EVENT: 'EVENT',
  MAINTENANCE: 'MAINTENANCE',
  GENERAL: 'GENERAL'
} as const;

export const AUDIT_CATEGORIES = {
  SECURITY: 'SECURITY',
  DATA_CHANGE: 'DATA_CHANGE',
  WORKFLOW: 'WORKFLOW',
  SYSTEM: 'SYSTEM',
  ACCESS: 'ACCESS'
} as const;