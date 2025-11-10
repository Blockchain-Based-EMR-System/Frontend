export interface DashboardUser {
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

export interface GoogleUserDataResponse {
  data: DashboardUser;
  message: string;
}

export interface ApiError {
  messageEn: string;
  messageAr: string;
}
