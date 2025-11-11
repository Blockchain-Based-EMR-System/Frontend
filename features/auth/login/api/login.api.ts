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
  });
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  console.log("Logging out user...");
  return api.post<LogoutResponse>("/auth/logout");
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  return api.post<RefreshTokenResponse>("/auth/refresh");
};
