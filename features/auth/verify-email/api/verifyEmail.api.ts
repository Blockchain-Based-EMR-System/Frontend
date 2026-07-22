import { api } from "@/lib/apiClient";
import {
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendOtpResponse,
} from "../types/verifyEmailTypes";

export const verifyEmail = async (
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> => {
  return api.patch<VerifyEmailResponse>("/auth/verify-otp", data);
};

export const resendOtp = async (): Promise<ResendOtpResponse> => {
  return api.post<ResendOtpResponse>("/auth/resend-otp");
};
