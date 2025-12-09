import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateGoogleUserPhone } from "../api/googleAuth.api";
import {
  UpdatePhoneRequest,
  UpdatePhoneResponse,
} from "../types/googleAuthTypes";
import { ApiError } from "@/types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useRouter } from "next/navigation";
import { useAuthSync } from "@/hooks/useAuthSync";

export const useUpdateGoogleUserPhone = (): UseMutationResult<
  UpdatePhoneResponse,
  AxiosError<ApiError>,
  UpdatePhoneRequest
> => {
  const { locale } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { updateAuthState } = useAuthSync();

  return useMutation({
    mutationFn: updateGoogleUserPhone,
    onSuccess: (data) => {
      if (data.data) {
        updateAuthState(data.data);
        queryClient.setQueryData(["dashboard", "user"], data.data);
      }

      const successMessage =
        data.message ||
        (locale === "ar"
          ? data.messageAr || "تم تحديث رقم الهاتف بنجاح"
          : data.messageEn || "Phone number updated successfully");

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
