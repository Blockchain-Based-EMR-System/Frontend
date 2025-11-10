export interface LoginRequest {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  data?: User; 
  message?: string;
  messageEn?: string;
  messageAr?: string;
  token?: string;
}

export interface LogoutResponse {
  messageEn?: string;
  messageAr?: string;
}

export interface RefreshTokenResponse {
  messageEn?: string;
  messageAr?: string;
  token?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  gender?: "MALE" | "FEMALE" | null;
  date_of_birth?: string | null;
  isVerified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  messageEn: string;
  messageAr: string;
}
