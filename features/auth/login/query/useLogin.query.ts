import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { loginUser, logoutUser, refreshToken } from "../api/login.api";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from "../types/authTypes";
import { ApiError } from "@/types/common";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export const useLogin = (): UseMutationResult<
  LoginResponse,
  AxiosError<ApiError>,
  LoginRequest
> => {
  const { locale } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      if (data.data) {
        setUser(data.data);
        queryClient.setQueryData(["dashboard", "user"], data.data);
      } else {
        console.warn("No Data");
      }

      const successMessage =
        data.message ||
        (locale === "ar"
          ? data.messageAr || "تم تسجيل الدخول بنجاح"
          : data.messageEn || "Login successful");

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
          ? errorData?.messageAr || "حدث خطأ أثناء تسجيل الدخول"
          : errorData?.messageEn || "An error occurred during login";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Login Error:", error);
      }
    },
  });
};

export const useLogout = (): UseMutationResult<
  LogoutResponse,
  AxiosError<ApiError>,
  void
> => {
  const { locale } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useUserStore((state) => state.clearUser);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      clearUser();
      queryClient.clear();

      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم تسجيل الخروج بنجاح"
          : data.messageEn || "Logout successful";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      router.push("/login");
    },
    onError: (error) => {
      clearUser();
      queryClient.clear();

      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "حدث خطأ أثناء تسجيل الخروج"
          : errorData?.messageEn || "An error occurred during logout";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      router.push("/login");
    },
  });
};

export const useRefreshToken = (): UseMutationResult<
  RefreshTokenResponse,
  AxiosError<ApiError>,
  void
> => {
  return useMutation({
    mutationFn: refreshToken,
    onError: (error) => {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      if (process.env.NODE_ENV === "development") {
        console.error("Token Refresh Error:", error);
      }
    },
  });
};
