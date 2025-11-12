import { User, ApiResponse } from "@/types/common";

export type DashboardUser = User;

export interface GoogleUserDataResponse extends ApiResponse<User> {
  data: User;
  message: string; 
}
