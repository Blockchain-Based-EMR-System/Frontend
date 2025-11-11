import { api } from "@/lib/apiClient";
import {
  SignupRequest,
  SignupResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  CompleteProfileRequest,
  CompleteProfileResponse,
} from "../types/authTypes";

export const signupUser = async (
  userData: SignupRequest
): Promise<SignupResponse> => {
  return api.post<SignupResponse>("/auth/signup", userData, {
  });
};

export const verifyOTP = async (
  otpData: VerifyOTPRequest
): Promise<VerifyOTPResponse> => {
  return api.patch<VerifyOTPResponse>("/auth/verify-otp", otpData);
};

export const completeProfile = async (
  profileData: CompleteProfileRequest
): Promise<CompleteProfileResponse> => {
  return api.patch<CompleteProfileResponse>(
    "/auth/complete-profile-info",
    profileData
  );
};
