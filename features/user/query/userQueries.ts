import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfilePicture,
  deleteProfilePicture,
  getProfilePicture,
} from "../api/userApi";
import { useToast } from "@/hooks/useToast";
import { useUserStore } from "@/stores/useUserStore";
import {
  UpdateProfilePictureResponse,
  DeleteProfilePictureResponse,
} from "../types/userTypes";

export const useUpdateProfilePicture = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation<UpdateProfilePictureResponse, Error, File>({
    mutationFn: updateProfilePicture,
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      try {
        const response = await getProfilePicture();
        let profilePictureUrl = response.url;

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
    onError: (error) => {
      console.error("Error updating profile picture:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProfilePicture = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation<DeleteProfilePictureResponse, Error, void>({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile picture deleted successfully",
      });

      updateUser({ profilePicture: null });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error deleting profile picture:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete profile picture",
        variant: "destructive",
      });
    },
  });
};
