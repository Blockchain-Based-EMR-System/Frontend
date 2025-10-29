"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LoginFormData } from "./LoginForm";
import { useToast } from "@/hooks/use-toast";

export interface LoginContainerProps {
  children: (props: LoginPresentationalProps) => React.ReactNode;
}

export interface LoginPresentationalProps {
  isLoading: boolean;
  handleLogin: (data: LoginFormData) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  t: (key: string) => string;
}

export function LoginContainer({ children }: LoginContainerProps) {
  const t = useTranslations("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      toast({
        title: t("loginSuccess"),
        description: t("welcomeBack"),
      });

    } catch (error: any) {
      toast({
        title: t("loginError"),
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      toast({
        title: t("loginSuccess"),
        description: t("welcomeBack"),
      });

    } catch (error: any) {
      toast({
        title: t("loginError"),
        description: error.message || "Google login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <>{children({ isLoading, handleLogin, handleGoogleLogin, t })}</>;
}
