export interface NurseProfile {
  account_status: "PENDING" | "APPROVED" | "REJECTED";
  years_of_experience?: number | null;
  brief?: string | null;
  nationalCardUrl?: string | null;
  bonusFileUrl?: string | null;
}

export interface Nurse {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  phone?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  photo_url?: string | null;
  isVerified?: boolean;
  hasCompletedProfile?: boolean;
  nurse?: NurseProfile;
}

export interface GetUnverifiedNursesResponse {
  data: Nurse[];
  messageEn: string;
  messageAr: string;
}

export interface GetAllNursesResponse {
  data: Nurse[];
  messageEn: string;
  messageAr: string;
}
