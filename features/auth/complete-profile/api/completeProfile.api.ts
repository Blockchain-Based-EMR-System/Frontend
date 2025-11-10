import { api } from "@/lib/apiClient";
import {
  CompleteProfileRequest,
  CompleteProfileResponse,
  UpdateGoogleUserPhoneRequest,
  UpdateGoogleUserPhoneResponse,
} from "../types/completeProfileTypes";

export const completeProfile = async (
  data: CompleteProfileRequest
): Promise<CompleteProfileResponse> => {
  const response = await api.patch<CompleteProfileResponse>(
    "/auth/complete-profile-info",
    data
  );
  return response;
};

export const updateGoogleUserPhone = async (
  data: UpdateGoogleUserPhoneRequest
): Promise<UpdateGoogleUserPhoneResponse> => {
  const response = await api.patch<UpdateGoogleUserPhoneResponse>(
    "/auth/google/update-phone",
    data
  );
  return response;
};
