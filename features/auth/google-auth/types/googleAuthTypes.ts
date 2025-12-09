import { User, AuthResponse, ApiResponse } from "@/types";

export interface GoogleAuthResponse extends AuthResponse {}

export interface UpdatePhoneRequest {
  phone: string;
}

export interface UpdatePhoneResponse extends ApiResponse<User> {}
