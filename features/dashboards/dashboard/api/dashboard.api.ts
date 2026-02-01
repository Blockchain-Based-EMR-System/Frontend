import { api } from "@/lib/apiClient";
import { DashboardUser, GoogleUserDataResponse } from "../types/dashboardTypes";

export const getCurrentUser = async (): Promise<DashboardUser> => {
  const response = await api.get<GoogleUserDataResponse>(
    "/auth/google/userData"
  );
  return response.data;
};
