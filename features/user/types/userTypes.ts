export interface UpdateProfilePictureResponse {
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface DeleteProfilePictureResponse {
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface GetProfilePictureResponse {
  data: {
    url: string;
  };
  message?: string;
  messageEn?: string;
  messageAr?: string;
}
