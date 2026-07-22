import { Doctor } from "@/types/user";

export interface CreateDoctorRequest {
  email: string;
  name: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
}

export interface DoctorListResponse {
  data: Doctor[];
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface DoctorDetailResponse {
  data: Doctor;
  message?: string;
  messageEn?: string;
  messageAr?: string;
}
