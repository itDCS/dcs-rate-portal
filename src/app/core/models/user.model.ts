export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  phone?: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
  isActive: boolean;
  isEnabled: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

// Aliases for backward compatibility
export type LoginRequest = LoginData;
export type RegisterRequest = RegisterData;
export type LoginResponse = AuthResponse;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  startedAt?: string | null;
  estimatedEnd?: string | null;
  lastUpdated?: string | null;
}
