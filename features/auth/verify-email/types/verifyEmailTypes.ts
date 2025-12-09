import { ApiResponse, BaseResponse } from "@/types";

export interface VerifyEmailRequest {
  otp: string;
}

export interface VerifyEmailResponse extends ApiResponse<boolean> {
  message: string; 
}

export interface ResendOtpResponse extends BaseResponse {}
