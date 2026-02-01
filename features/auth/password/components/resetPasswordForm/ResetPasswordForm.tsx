"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { createResetPasswordSchema } from "./ResetPasswordSchema";

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading: boolean;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading,
}: ResetPasswordFormProps) {
  const tAuth = useTranslations("auth");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");
  const language = useLanguage();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema(tFields)),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">{tFields("newPassword")}</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder={tFields("newPasswordPlaceholder")}
            {...register("newPassword")}
            disabled={isLoading}
            aria-invalid={!!errors.newPassword}
            className={`py-5 ${
              language.locale === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"
            }`}
          />
          <Lock
            className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${
              language.locale === "ar" ? "right-3" : "left-3"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
              language.locale === "ar" ? "left-3" : "right-3"
            }`}
            disabled={isLoading}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">{tFields("confirmPassword")}</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={tFields("confirmPasswordPlaceholder")}
            {...register("confirmPassword")}
            disabled={isLoading}
            aria-invalid={!!errors.confirmPassword}
            className={`py-5 ${
              language.locale === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"
            }`}
          />
          <Lock
            className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${
              language.locale === "ar" ? "right-3" : "left-3"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
              language.locale === "ar" ? "left-3" : "right-3"
            }`}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {tCommon("resetting")}
          </>
        ) : (
          tAuth("resetPassword")
        )}
      </Button>
    </form>
  );
}
