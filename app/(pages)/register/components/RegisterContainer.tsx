"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RegisterFormData } from "./RegisterForm";
import { useToast } from "@/hooks/use-toast";

export interface RegisterContainerProps {
  children: (props: RegisterPresentationalProps) => React.ReactNode;
}

export interface RegisterPresentationalProps {
  isLoading: boolean;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  handleGoogleRegister: () => Promise<void>;
  t: (key: string) => string;
}

export function RegisterContainer({ children }: RegisterContainerProps) {
  const t = useTranslations("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      toast({
        title: t("registerSuccess"),
        description: t("accountCreated"),
      });
    } catch (error: any) {
      toast({
        title: t("registerError"),
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

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      toast({
        title: t("registerSuccess"),
        description: t("accountCreated"),
      });
    } catch (error: any) {
      toast({
        title: t("registerError"),
        description: error.message || "Google registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>{children({ isLoading, handleRegister, handleGoogleRegister, t })}</>
  );
}
