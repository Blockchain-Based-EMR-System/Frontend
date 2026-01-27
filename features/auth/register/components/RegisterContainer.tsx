"use client";

import { useTranslations } from "next-intl";
import { RegisterFormData } from "./registerForm/RegisterForm";
import { useSignup } from "../query/useRegister.query";
import { initiateGoogleAuth } from "@/features/auth/google-auth/api/googleAuth.api";
import { useAuthFlowStore } from "@/stores/useAuthFlowStore";

export interface RegisterContainerProps {
  children: (props: RegisterPresentationalProps) => React.ReactNode;
}

export interface RegisterPresentationalProps {
  isLoading: boolean;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  handleGoogleRegister: () => void;
  t: (key: string) => string;
}

export function RegisterContainer({ children }: RegisterContainerProps) {
  const t = useTranslations("auth");
  const signupMutation = useSignup();
  const setSignupMethod = useAuthFlowStore((state) => state.setSignupMethod);

  const handleRegister = async (data: RegisterFormData) => {
    await signupMutation.mutateAsync({
      email: data.email,
      name: data.fullName,
      password: data.password,
      phone: data.phoneNumber,
    });
  };

  const handleGoogleRegister = () => {
    setSignupMethod("google");
    initiateGoogleAuth();
  };

  return (
    <>
      {children({
        isLoading: signupMutation.isPending,
        handleRegister,
        handleGoogleRegister,
        t,
      })}
    </>
  );
}
