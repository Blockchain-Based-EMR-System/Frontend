"use client";

import Link from "next/link";
import {
  ForgotPasswordForm,
  ForgotPasswordFormData,
} from "./forgotPasswordForm/ForgotPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export interface ForgotPasswordPresentationalProps {
  isLoading: boolean;
  handleForgotPassword: (data: ForgotPasswordFormData) => Promise<void>;
  t: (key: string) => string;
}

export function ForgotPasswordPresentational({
  isLoading,
  handleForgotPassword,
  t,
}: ForgotPasswordPresentationalProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("forgotPassword")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("forgotPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
