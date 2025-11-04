"use client";

import Link from "next/link";
import { LoginForm, LoginFormData } from "./loginForm/LoginForm";
import { GoogleLoginButton } from "@/components/common/GoogleLoginButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface LoginPresentationalProps {
  isLoading: boolean;
  handleLogin: (data: LoginFormData) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  t: (key: string) => string;
}

export function LoginPresentational({
  isLoading,
  handleLogin,
  handleGoogleLogin,
  t,
}: LoginPresentationalProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t("welcomeBack")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

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
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            text={t("continueWithGoogle")}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {t("dontHaveAccount")}{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              {t("signUp")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
