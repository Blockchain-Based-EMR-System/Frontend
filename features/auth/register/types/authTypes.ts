import { User, Gender, ApiResponse } from "@/types";

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  phone: string;
}

export interface SignupResponse extends ApiResponse<User> {}

export interface VerifyOTPRequest {
  otp: string;
}

export interface VerifyOTPResponse extends ApiResponse<boolean> {}

export interface CompleteProfileRequest {
  gender: Gender;
  date_of_birth: string;
}

export interface CompleteProfileResponse extends ApiResponse<User> {}
