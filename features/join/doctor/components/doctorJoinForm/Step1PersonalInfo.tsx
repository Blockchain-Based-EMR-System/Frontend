"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { DoctorJoinFormData } from "../../types/doctorJoinTypes";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useTranslations } from "next-intl";

interface Step1PersonalInfoProps {
  form: UseFormReturn<DoctorJoinFormData>;
  t: (key: string, values?: Record<string, any>) => string;
  isLoading: boolean;
}

export function Step1PersonalInfo({
  form,
  t,
  isLoading,
}: Step1PersonalInfoProps) {
  const tDoctorJoining = useTranslations("doctorJoining");
  const { direction } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const dateOfBirth = watch("dateOfBirth");
  const gender = watch("gender");
  const availabilityType = watch("availability_type");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{tDoctorJoining("step1Title")}</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            id="fullName"
            type="text"
            placeholder={t("fullNamePlaceholder")}
            {...register("fullName")}
            disabled={isLoading}
            className="py-5"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            disabled={isLoading}
            className="py-5"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            dir={direction}
            id="phoneNumber"
            type="tel"
            placeholder={t("phoneNumberPlaceholder")}
            {...register("phoneNumber")}
            disabled={isLoading}
            className="py-5"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Select
            dir={direction}
            value={gender}
            onValueChange={(value) =>
              setValue("gender", value as "MALE" | "FEMALE", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger className="py-5">
              <SelectValue placeholder={t("selectGender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">{t("male")}</SelectItem>
              <SelectItem value="FEMALE">{t("female")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Select
            dir={direction}
            value={availabilityType}
            onValueChange={(value) =>
              setValue(
                "availability_type",
                value as "ONLINE" | "OFFLINE" | "BOTH",
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              )
            }
            disabled={isLoading}
          >
            <SelectTrigger className="py-5">
              <SelectValue placeholder={t("selectAvailabilityType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONLINE">{t("online")}</SelectItem>
              <SelectItem value="OFFLINE">{t("offline")}</SelectItem>
              <SelectItem value="BOTH">{t("both")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.availability_type && (
            <p className="text-sm text-destructive">
              {errors.availability_type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <DatePickerPopover
            date={dateOfBirth}
            onDateChange={(date) => {
              setValue("dateOfBirth", date as Date, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            placeholder={t("pickDateOfBirth")}
            disabled={isLoading}
            hasError={!!errors.dateOfBirth}
            fromYear={1940}
            toYear={new Date().getFullYear() - 18}
            disableFutureDates={true}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              {...register("password")}
              disabled={isLoading}
              className="py-5"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${direction === "rtl" ? "left-3 right-auto" : ""}`}
              tabIndex={-1}
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

        <div className="space-y-2">
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              {...register("confirmPassword")}
              disabled={isLoading}
              className="py-5"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${direction === "rtl" ? "left-3 right-auto" : ""}`}
              tabIndex={-1}
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
      </div>
    </div>
  );
}
