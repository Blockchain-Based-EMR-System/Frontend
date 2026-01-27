"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { createRegisterSchema } from "./registerSchema";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  rememberMe?: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const tAuth = useTranslations("auth");
  const language = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(tAuth)),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <Input
            id="fullName"
            type="text"
            placeholder={tAuth("fullNamePlaceholder")}
            {...register("fullName")}
            disabled={isLoading}
            aria-invalid={!!errors.fullName}
            className="py-5"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Input
            id="email"
            type="email"
            placeholder={tAuth("emailPlaceholder")}
            {...register("email")}
            disabled={isLoading}
            aria-invalid={!!errors.email}
            className="py-5"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Input
            id="phoneNumber"
            type="tel"
            placeholder={tAuth("phoneNumberPlaceholder")}
            {...register("phoneNumber")}
            disabled={isLoading}
            aria-invalid={!!errors.phoneNumber}
            className="py-5"
            dir={language.locale === "ar" ? "rtl" : "ltr"}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={tAuth("passwordPlaceholder")}
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

        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={tAuth("confirmPasswordPlaceholder")}
              {...register("confirmPassword")}
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              className={`py-5 ${language.locale === "ar" ? "pl-10" : "pr-10"}`}
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

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox
            id="rememberMe"
            {...register("rememberMe")}
            disabled={isLoading}
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {tAuth("rememberMe")}
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tAuth("signUp")}...
            </>
          ) : (
            tAuth("signUp")
          )}
        </Button>
      </form>
    </div>
  );
}
