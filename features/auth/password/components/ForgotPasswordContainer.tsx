"use client";

import { useTranslations } from "next-intl";
import { ForgotPasswordFormData } from "./forgotPasswordForm/ForgotPasswordForm";
import { useForgetPassword } from "../query/usePassword.query";

export interface ForgotPasswordContainerProps {
  children: (props: ForgotPasswordPresentationalProps) => React.ReactNode;
}

export interface ForgotPasswordPresentationalProps {
  isLoading: boolean;
  handleForgotPassword: (data: ForgotPasswordFormData) => Promise<void>;
  t: (key: string) => string;
}

export function ForgotPasswordContainer({
  children,
}: ForgotPasswordContainerProps) {
  const t = useTranslations("auth");
  const forgetPasswordMutation = useForgetPassword();

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    await forgetPasswordMutation.mutateAsync({
      email: data.email,
    });
  };

  return (
    <>
      {children({
        isLoading: forgetPasswordMutation.isPending,
        handleForgotPassword,
        t,
      })}
    </>
  );
}
