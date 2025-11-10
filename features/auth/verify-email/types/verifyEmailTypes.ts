export interface VerifyEmailRequest {
  otp: string;
}

export interface VerifyEmailResponse {
  data: boolean;
  message: string;
  messageEn?: string;
  messageAr?: string;
}

export interface ResendOtpResponse {
  messageEn?: string;
  messageAr?: string;
}

export interface ApiError {
  messageEn: string;
  messageAr: string;
}
