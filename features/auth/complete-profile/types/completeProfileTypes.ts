export interface CompleteProfileRequest {
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
}

export interface CompleteProfileResponse {
  data: User;
  message: string;
  messageEn?: string;
  messageAr?: string;
}

export interface UpdateGoogleUserPhoneRequest {
  phone: string;
}

export interface UpdateGoogleUserPhoneResponse {
  message: string;
  messageEn?: string;
  messageAr?: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  username?: string;
  phone?: string | null;
  gender?: "MALE" | "FEMALE" | null;
  date_of_birth?: string | null;
  isVerified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiError {
  messageEn: string;
  messageAr: string;
}
