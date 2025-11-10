import { api } from "@/lib/apiClient";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from "../types/authTypes";

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  return api.post<LoginResponse>("/auth/login", credentials, {
    skipAuth: true,
  });
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  return api.post<LogoutResponse>("/auth/logout");
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  return api.post<RefreshTokenResponse>("/auth/refresh");
};
