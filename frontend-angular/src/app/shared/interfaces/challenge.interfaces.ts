// ====================================================================
// 🎯 CHALLENGE INTERFACES - Supporting TypeScript Definitions
// ====================================================================
//
// These interfaces provide TypeScript support for the challenge features.
// Candidates can use these or create their own - both approaches are valid.

// Feature 1: Pizza Discovery Interfaces
export interface PizzaQueryParams {
  filter?: 'veg' | 'non-veg';
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPizzaResponse {
  pizzas: any[]; // Use existing Pizza interface from cart.service
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
}

export type FilterType = 'all' | 'veg' | 'non-veg';
export type SortType = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export interface PizzaListState {
  pizzas: any[];
  currentFilter: FilterType;
  currentSort: SortType;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  searchQuery: string;
  error: string | null;
}

// Feature 2: Real-time Admin Dashboard Interfaces
export interface OrderUpdate {
  orderId: string;
  newStatus: string;
  loading?: boolean;
  error?: string;
}

export interface AdminDashboardState {
  orders: any[]; // Use existing Order interface from api.service
  isPolling: boolean;
  lastUpdated: Date;
  pollingInterval: number;
  isTabVisible: boolean;
  error: string | null;
}

// Feature 3: Complaint Form Interfaces
export interface ComplaintFormData {
  complaintType: 'Quality Issue' | 'Delivery Problem' | 'Wrong Order' | 'Other';
  description: string;
  priority: 'low' | 'medium' | 'high';
  contactPreference: string[]; // ['email', 'phone']
}

export interface ComplaintFormState {
  selectedOrderId: string | null;
  showForm: boolean;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

export interface ComplaintFormOption {
  value: string;
  label: string;
}

// Custom Validation Interfaces
export interface ValidationError {
  [key: string]: any;
}

export interface FormValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: any) => ValidationError | null;
}

// API Response Interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  error?: any;
}

// Real-time Polling Interfaces
export interface PollingConfig {
  interval: number;
  retryAttempts: number;
  pauseOnHidden: boolean;
  immediateStart: boolean;
}

export interface PollingState {
  isActive: boolean;
  lastPoll: Date | null;
  errorCount: number;
  isTabVisible: boolean;
}