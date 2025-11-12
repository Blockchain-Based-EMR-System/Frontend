import { User, Gender, ApiResponse, BaseResponse } from "@/types/common";

export interface CompleteProfileRequest {
  gender: Gender;
  date_of_birth: string;
}

export interface CompleteProfileResponse extends ApiResponse<User> {
  data: User; 
  message: string; 
}

export interface UpdateGoogleUserPhoneRequest {
  phone: string;
}

export interface UpdateGoogleUserPhoneResponse extends BaseResponse {
  message: string; 
}
