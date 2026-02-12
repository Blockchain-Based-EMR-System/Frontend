import { ApiResponse } from "@/types";

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE";
  date_of_birth?: string;
  availability_type?: "ONLINE" | "OFFLINE" | "BOTH";
}

export interface UpdateProfileResponse extends ApiResponse<undefined> {}

export interface CheckPasswordRequest {
  password: string;
}

export interface CheckPasswordResponse extends ApiResponse<{
  isMatch: boolean;
}> {}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse extends ApiResponse<undefined> {}

export interface ProfileFormData {
  name: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: Date;
  profilePicture?: File | null;
  availability_type?: "ONLINE" | "OFFLINE" | "BOTH";
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
