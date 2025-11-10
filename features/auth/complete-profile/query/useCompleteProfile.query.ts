import { useMutation, UseMutationResult } from "@tanstack/react-query";
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
  ApiError,
} from "../types/completeProfileTypes";
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
  const updateUser = useUserStore((state) => state.updateUser);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: completeProfile,
    onSuccess: (data) => {
      if (data.data) {
        if (user) {
          updateUser({
            gender: data.data.gender,
            date_of_birth: data.data.date_of_birth,
            isVerified: data.data.isVerified,
            phone: data.data.phone || user.phone,
            email: data.data.email || user.email,
            name: data.data.name || user.name,
            username: data.data.username || user.username,
          });

        } else {
          const currentUser = useUserStore.getState().user;

          setUser({
            ...data.data,
            email: data.data.email || currentUser?.email || "",
            name: data.data.name || currentUser?.name || "",
            phone: data.data.phone || currentUser?.phone || "",
            username: data.data.username || currentUser?.username,
            id: data.data.id || currentUser?.id,
          });
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
  const updateUser = useUserStore((state) => state.updateUser);
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: updateGoogleUserPhone,
    onSuccess: (data, variables) => {
      if (user) {
        updateUser({ phone: variables.phone });
      } else {
        console.warn(
          "User is null"
        );
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
