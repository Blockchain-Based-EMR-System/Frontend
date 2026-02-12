import { api } from "@/lib/apiClient";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  CheckPasswordRequest,
  CheckPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/settings.types";

export const updateProfile = async (
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const response = await api.patch<UpdateProfileResponse>(
    "/users/update-profile",
    data,
  );
  return response;
};

export const checkPassword = async (
  data: CheckPasswordRequest,
): Promise<CheckPasswordResponse> => {
  const response = await api.post<CheckPasswordResponse>(
    "/auth/check-password",
    { password: data.password },
  );
  return response;
};

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  const response = await api.patch<ChangePasswordResponse>(
    "/auth/change-password",
    {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    },
  );
  return response;
};
