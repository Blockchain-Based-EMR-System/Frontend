import { ApiResponse } from "@/types";

export interface NurseWorkingDay {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface NurseClinic {
  id: string;
  name: string;
  address: string;
  address_maps_link?: string | null;
  working_days: NurseWorkingDay[];
}

export interface DoctorNurse {
  id: string;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  phone: string;
  age: number;
  profilePic?: string | null;
  years_of_experience: number;
  nationalCardUrl?: string | null;
  bonusFileUrl?: string | null;
  brief?: string | null;
  clinics: NurseClinic[];
}

export interface GetDoctorNursesResponse extends ApiResponse<DoctorNurse[]> {}
