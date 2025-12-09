import { AuthResponse, BaseResponse } from "@/types";

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse extends AuthResponse {}

export interface LogoutResponse extends BaseResponse {}

export interface RefreshTokenResponse extends BaseResponse {
  token?: string;
}
