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
import { NurseJoinFormData } from "../../types/nurseJoinTypes";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useTranslations } from "next-intl";

interface Step1PersonalInfoProps {
  form: UseFormReturn<NurseJoinFormData>;
  tFields: (key: string, values?: Record<string, any>) => string;
  isLoading: boolean;
}

export function Step1PersonalInfo({
  form,
  tFields,
  isLoading,
}: Step1PersonalInfoProps) {
  const tNurse = useTranslations("nurseJoining");
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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{tNurse("step1Title")}</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            id="fullName"
            type="text"
            placeholder={tFields("fullNamePlaceholder")}
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
            placeholder={tFields("emailPlaceholder")}
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
            placeholder={tFields("phoneNumberPlaceholder")}
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
              <SelectValue placeholder={tFields("selectGender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">{tFields("male")}</SelectItem>
              <SelectItem value="FEMALE">{tFields("female")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <DatePickerPopover
            date={dateOfBirth}
            onDateChange={(date) =>
              setValue("dateOfBirth", date as Date, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            placeholder={tFields("pickDateOfBirth")}
            disabled={isLoading}
            disableFutureDates
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
              placeholder={tFields("passwordPlaceholder")}
              {...register("password")}
              disabled={isLoading}
              className="py-5 pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((v) => !v)}
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
              placeholder={tFields("confirmPasswordPlaceholder")}
              {...register("confirmPassword")}
              disabled={isLoading}
              className="py-5 pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword((v) => !v)}
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
