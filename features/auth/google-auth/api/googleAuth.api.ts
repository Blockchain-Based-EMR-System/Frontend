import { api } from "@/lib/apiClient";
import {
  UpdatePhoneRequest,
  UpdatePhoneResponse,
} from "../types/googleAuthTypes";

export const initiateGoogleAuth = (): void => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  window.location.href = `${API_BASE_URL}/auth/google`;
};

export const updateGoogleUserPhone = async (
  data: UpdatePhoneRequest
): Promise<UpdatePhoneResponse> => {
  return api.patch<UpdatePhoneResponse>("/auth/google/update-phone", data);
};
