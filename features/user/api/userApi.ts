import { api } from "@/lib/apiClient";
import {
  UpdateProfilePictureResponse,
  DeleteProfilePictureResponse,
  GetProfilePictureResponse,
} from "../types/userTypes";

export const updateProfilePicture = async (
  file: File,
): Promise<UpdateProfilePictureResponse> => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await api.patch<UpdateProfilePictureResponse>(
    "/users/profile-picture",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response;
};

export const deleteProfilePicture =
  async (): Promise<DeleteProfilePictureResponse> => {
    const response = await api.delete<DeleteProfilePictureResponse>(
      "/users/profile-picture",
    );

    return response;
  };

export const getProfilePicture =
  async (): Promise<GetProfilePictureResponse> => {
    const response = await api.get<GetProfilePictureResponse>(
      "/users/profile-picture",
    );

    return response;
  };
