import { api } from "@/lib/apiClient";
import {
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/passwordTypes";

export const forgetPassword = async (
  data: ForgetPasswordRequest
): Promise<ForgetPasswordResponse> => {
  return api.post<ForgetPasswordResponse>("/auth/forget-password", data, {
  });
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  return api.post<ResetPasswordResponse>("/auth/reset-password", data, {
  });
};
