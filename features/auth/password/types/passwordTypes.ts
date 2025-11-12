import { BaseResponse } from "@/types/common";

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse extends BaseResponse {}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse extends BaseResponse {}
