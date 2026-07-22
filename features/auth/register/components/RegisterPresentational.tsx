"use client";

import Link from "next/link";
import { RegisterForm, RegisterFormData } from "./registerForm/RegisterForm";
import { GoogleLoginButton } from "@/components/common/GoogleLoginButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface RegisterPresentationalProps {
  isLoading: boolean;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  handleGoogleRegister: () => void;
  t: (key: string) => string;
}

export function RegisterPresentational({
  isLoading,
  handleRegister,
  handleGoogleRegister,
  t,
}: RegisterPresentationalProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t("createAccount")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                {t("continueWith")}
              </span>
            </div>
          </div>

          <GoogleLoginButton
            onClick={handleGoogleRegister}
            isLoading={isLoading}
            text={t("registerWithGoogle")}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              {t("signIn")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
