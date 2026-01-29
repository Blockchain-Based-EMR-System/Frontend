import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfilePicture,
  deleteProfilePicture,
  getProfilePicture,
} from "../api/userApi";
import { useToast } from "@/hooks/useToast";
import { useUserStore } from "@/stores/useUserStore";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getLocalizedMessage } from "@/lib/helpers";
import {
  UpdateProfilePictureResponse,
  DeleteProfilePictureResponse,
} from "../types/userTypes";

export const useUpdateProfilePicture = () => {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation<UpdateProfilePictureResponse, Error, File>({
    mutationFn: updateProfilePicture,
    onSuccess: async (data) => {
      toast({
        title: "Success",
        description: getLocalizedMessage(data, locale),
      });

      try {
        const response = await getProfilePicture();
        let profilePictureUrl = response.data?.url;

        if (profilePictureUrl && !profilePictureUrl.startsWith("http")) {
          const apiBase =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
          profilePictureUrl = `${apiBase}${profilePictureUrl.startsWith("/") ? "" : "/"}${profilePictureUrl}`;
        }

        if (profilePictureUrl) {
          updateUser({ profilePicture: profilePictureUrl });
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("Error updating profile picture:", error);
      const errorMessage = error?.response?.data
        ? getLocalizedMessage(error.response.data, locale)
        : error?.message || "Failed to upload profile picture";
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProfilePicture = () => {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation<DeleteProfilePictureResponse, Error, void>({
    mutationFn: deleteProfilePicture,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: getLocalizedMessage(data, locale),
      });

      updateUser({ profilePicture: null });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("Error deleting profile picture:", error);
      const errorMessage = error?.response?.data
        ? getLocalizedMessage(error.response.data, locale)
        : error?.message || "Failed to delete profile picture";
      toast({
        title: "Delete failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
