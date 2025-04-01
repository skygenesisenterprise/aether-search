// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Search types
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  datePublished: string;
  type?: string;
  fileType?: string;
  source?: string;
}

export interface SearchFilters {
  fileType?: string;
  timeRange?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  exactMatch?: boolean;
  excludeAdult?: boolean;
  includeRelated?: boolean;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
