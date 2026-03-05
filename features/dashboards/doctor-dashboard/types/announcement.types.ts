import { NurseAnnouncement } from "@/features/join/nurse";

export interface DoctorAnnouncementsResponse {
  data: NurseAnnouncement[];
  messageEn: string;
  messageAr: string;
}

export interface NurseApplicant {
  id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
  age?: number;
  profilePic?: string | null;
  years_of_experience?: number;
  nationalCardUrl?: string | null;
  brief?: string | null;
  bonusFileUrl?: string | null;
}

export interface ApplicantsResponse {
  data: NurseApplicant[];
  messageEn: string;
  messageAr: string;
}

export interface CreateAnnouncementRequest {
  clinic_id: string;
  working_days: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  }[];
  gender?: "MALE" | "FEMALE";
  max_age?: number;
  years_of_experience?: number;
  notes?: string;
}

export interface UpdateAnnouncementRequest {
  clinic_id?: string;
  working_days?: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  }[];
  gender?: "MALE" | "FEMALE" | null;
  max_age?: number | null;
  years_of_experience?: number | null;
  notes?: string | null;
}

export interface AnnouncementActionResponse {
  messageEn: string;
  messageAr: string;
}
