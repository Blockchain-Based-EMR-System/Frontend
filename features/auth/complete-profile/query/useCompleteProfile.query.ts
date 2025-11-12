import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  completeProfile,
  updateGoogleUserPhone,
} from "../api/completeProfile.api";
import {
  CompleteProfileRequest,
  CompleteProfileResponse,
  UpdateGoogleUserPhoneRequest,
  UpdateGoogleUserPhoneResponse,
} from "../types/completeProfileTypes";
import { ApiError } from "@/types/common";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export const useCompleteProfile = (): UseMutationResult<
  CompleteProfileResponse,
  AxiosError<ApiError>,
  CompleteProfileRequest
> => {
  const { locale } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateUser = useUserStore((state) => state.updateUser);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: completeProfile,
    onSuccess: (data) => {
      if (data.data) {
        if (user) {
          const updatedUser = {
            ...user,
            gender: data.data.gender,
            date_of_birth: data.data.date_of_birth,
            isVerified: data.data.isVerified,
            phone: data.data.phone || user.phone,
            email: data.data.email || user.email,
            name: data.data.name || user.name,
            username: data.data.username || user.username,
          };
          updateUser(updatedUser);
          // Set the updated data in the cache
          queryClient.setQueryData(["dashboard", "user"], updatedUser);
        } else {
          const currentUser = useUserStore.getState().user;

          const newUser = {
            ...data.data,
            email: data.data.email || currentUser?.email || "",
            name: data.data.name || currentUser?.name || "",
            phone: data.data.phone || currentUser?.phone || "",
            username: data.data.username || currentUser?.username,
            id: data.data.id || currentUser?.id || "",
          };
          setUser(newUser);
          // Set the data in the cache
          queryClient.setQueryData(["dashboard", "user"], newUser);
        }
      }

      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم إكمال الملف الشخصي بنجاح"
          : data.messageEn || "Profile completed successfully";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      router.push("/dashboard");
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "حدث خطأ أثناء إكمال الملف الشخصي"
          : errorData?.messageEn ||
            "An error occurred while completing profile";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Complete Profile Error:", error);
      }
    },
  });
};

export const useUpdateGoogleUserPhone = (): UseMutationResult<
  UpdateGoogleUserPhoneResponse,
  AxiosError<ApiError>,
  UpdateGoogleUserPhoneRequest
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();
  const updateUser = useUserStore((state) => state.updateUser);
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: updateGoogleUserPhone,
    onSuccess: (data, variables) => {
      if (user) {
        const updatedUser = { ...user, phone: variables.phone };
        updateUser({ phone: variables.phone });
        // Set the updated data in the cache
        queryClient.setQueryData(["dashboard", "user"], updatedUser);
      } else {
        console.warn("User is null");
      }

      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم تحديث رقم الهاتف بنجاح"
          : data.messageEn || "Phone number updated successfully";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "حدث خطأ أثناء تحديث رقم الهاتف"
          : errorData?.messageEn ||
            "An error occurred while updating phone number";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Update Phone Error:", error);
      }
    },
  });
};
