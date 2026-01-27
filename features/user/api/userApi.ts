import apiClient from "@/lib/apiClient";
import { AxiosResponse } from "axios";
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

  const response: AxiosResponse<UpdateProfilePictureResponse> =
    await apiClient.patch("/users/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  return response.data;
};

export const deleteProfilePicture =
  async (): Promise<DeleteProfilePictureResponse> => {
    const response: AxiosResponse<DeleteProfilePictureResponse> =
      await apiClient.delete("/users/profile-picture");

    return response.data;
  };

export const getProfilePicture =
  async (): Promise<GetProfilePictureResponse> => {
    const response: AxiosResponse<GetProfilePictureResponse> =
      await apiClient.get("/users/profile-picture");

    return response.data;
  };
