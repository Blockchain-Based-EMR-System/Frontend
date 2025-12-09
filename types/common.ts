import { User } from "./user";

export interface ApiError {
  messageEn: string;
  messageAr: string;
}

export interface BaseResponse {
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data?: T;
}

export interface AuthResponse extends BaseResponse {
  data?: User;
  token?: string;
}
