"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { createLoginSchema } from "./LoginSchema";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const t = useTranslations("");
  const language = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    },
  });

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-1.5">
          <Input
            id="emailOrUsername"
            type="text"
            placeholder={t("emailOrUsernamePlaceholder")}
            {...register("emailOrUsername")}
            disabled={isLoading}
            aria-invalid={!!errors.emailOrUsername}
            className="py-5"
          />
          {errors.emailOrUsername && (
            <p className="text-sm text-destructive">
              {errors.emailOrUsername.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              {...register("password")}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              className={`py-5 ${language.locale === "ar" ? "pl-10" : "pr-10"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
                language.locale === "ar" ? "left-3" : "right-3"
              }`}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("signIn")}...
            </>
          ) : (
            t("signIn")
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center">
        <a
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t("forgotPassword")}
        </a>
      </div>
    </div>
  );
}
