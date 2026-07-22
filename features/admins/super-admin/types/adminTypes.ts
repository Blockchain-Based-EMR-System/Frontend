import { Admin, Role } from "@/types/user";

export interface CreateAdminRequest {
  email: string;
  name: string;
  password: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
}

export interface AdminListResponse {
  data: Admin[];
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface AdminDetailResponse {
  data: Admin;
  message?: string;
  messageEn?: string;
  messageAr?: string;
}
