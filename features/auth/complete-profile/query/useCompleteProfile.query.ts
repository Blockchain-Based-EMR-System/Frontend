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
import { useAuthSync } from "@/hooks/useAuthSync";
import { getRedirectAfterAuth } from "@/lib/auth";

export const useCompleteProfile = (): UseMutationResult<
  CompleteProfileResponse,
  AxiosError<ApiError>,
  CompleteProfileRequest
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();
  const { updateAuthState } = useAuthSync();

  return useMutation({
    mutationFn: completeProfile,
    onSuccess: (data) => {
      if (data.data) {
        updateAuthState(data.data);
        queryClient.setQueryData(["dashboard", "user"], data.data);
      }

      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم إكمال الملف الشخصي بنجاح"
          : data.messageEn || "Profile completed successfully";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      const redirectPath = data.data
        ? getRedirectAfterAuth(data.data)
        : "/dashboard";
      window.location.href = redirectPath;
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
  const { user, updateAuthState } = useAuthSync();

  return useMutation({
    mutationFn: updateGoogleUserPhone,
    onSuccess: (data, variables) => {
      if (user) {
        const updatedUser = { ...user, phone: variables.phone };
        updateAuthState(updatedUser);
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
