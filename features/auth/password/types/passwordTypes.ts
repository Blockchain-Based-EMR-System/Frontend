export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse {
  messageEn?: string;
  messageAr?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  messageEn?: string;
  messageAr?: string;
}

export interface ApiError {
  messageEn: string;
  messageAr: string;
}
