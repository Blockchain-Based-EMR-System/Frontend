export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  phone: string;
}

export interface SignupResponse {
  data?: User; 
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface VerifyOTPRequest {
  otp: string;
}

export interface VerifyOTPResponse {
  data?: boolean; 
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface CompleteProfileRequest {
  gender: "MALE" | "FEMALE" | "OTHER";
  date_of_birth: string;
}

export interface CompleteProfileResponse {
  data?: User; 
  message?: string;
  messageEn?: string;
  messageAr?: string;
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
