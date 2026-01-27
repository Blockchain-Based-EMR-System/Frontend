"use client";

import { useTranslations } from "next-intl";
import { LoginFormData } from "./loginForm/LoginForm";
import { useLogin } from "../query/useLogin.query";
import { initiateGoogleAuth } from "@/features/auth/google-auth/api/googleAuth.api";

export interface LoginContainerProps {
  children: (props: LoginPresentationalProps) => React.ReactNode;
}

export interface LoginPresentationalProps {
  isLoading: boolean;
  handleLogin: (data: LoginFormData) => Promise<void>;
  handleGoogleLogin: () => void;
  t: (key: string) => string;
}

export function LoginContainer({ children }: LoginContainerProps) {
  const t = useTranslations("auth");
  const loginMutation = useLogin();

  const handleLogin = async (data: LoginFormData) => {
    await loginMutation.mutateAsync({
      emailOrUsername: data.emailOrUsername,
      password: data.password,
      rememberMe: data.rememberMe ?? false,
    });
  };

  const handleGoogleLogin = () => {
    initiateGoogleAuth();
  };

  return (
    <>
      {children({
        isLoading: loginMutation.isPending,
        handleLogin,
        handleGoogleLogin,
        t,
      })}
    </>
  );
}
