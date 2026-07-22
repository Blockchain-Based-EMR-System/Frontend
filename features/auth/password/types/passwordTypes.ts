import { BaseResponse } from "@/types";

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse extends BaseResponse {}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse extends BaseResponse {}
