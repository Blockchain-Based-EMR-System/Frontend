import { User, ApiResponse } from "@/types";

export type DashboardUser = User;

export interface GoogleUserDataResponse extends ApiResponse<User> {
  data: User;
  message: string; 
}
