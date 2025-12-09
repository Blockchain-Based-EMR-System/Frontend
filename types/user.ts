export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string | null;
  gender?: Gender | null;
  date_of_birth?: string | null;
  isVerified: boolean;
  hasCompletedProfile: boolean;
  created_at: string;
  updated_at: string;
}

export type Gender = "MALE" | "FEMALE";