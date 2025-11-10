export interface GoogleAuthResponse {
  data?: User; 
  message?: string;
  messageEn?: string;
  messageAr?: string;
  token?: string;
}

export interface UpdatePhoneRequest {
  phone: string;
}

export interface UpdatePhoneResponse {
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
