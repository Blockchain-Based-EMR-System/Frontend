"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { createCompleteProfileSchema } from "./CompleteProfileSchema";
import { useState } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageProvider";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";

interface CompleteProfileFormProps {
  onSubmit: (data: CompleteProfileFormData) => Promise<void>;
  isLoading: boolean;
  requirePhone: boolean;
  initialPhone?: string;
}

export interface CompleteProfileFormData {
  phone?: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
}

export function CompleteProfileForm({
  onSubmit,
  isLoading,
  requirePhone,
  initialPhone = "",
}: CompleteProfileFormProps) {
  const { locale } = useLanguage();
  const t = useTranslations("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(createCompleteProfileSchema(t, requirePhone)),
    defaultValues: {
      phone: initialPhone,
      gender: undefined,
      date_of_birth: "",
    },
  });

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setValue("gender", value as "MALE" | "FEMALE", {
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {requirePhone && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">{t("phoneNumber")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phoneNumberPlaceholder")}
            {...register("phone")}
            disabled={isLoading}
            aria-invalid={!!errors.phone}
            className="py-5"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="gender">{t("gender")}</Label>
        <Select
          value={selectedGender}
          onValueChange={handleGenderChange}
          disabled={isLoading}
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <SelectTrigger
            className={`py-5 ${errors.gender ? "border-destructive" : ""}`}
          >
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="date_of_birth">{t("dateOfBirth")}</Label>
        <DatePickerPopover
          date={date}
          onDateChange={(selectedDate) => {
            setDate(selectedDate);
            if (selectedDate) {
              setValue("date_of_birth", format(selectedDate, "yyyy-MM-dd"), {
                shouldValidate: true,
              });
            }
          }}
          placeholder={t("pickDate")}
          disabled={isLoading}
          hasError={!!errors.date_of_birth}
          fromYear={1900}
          toYear={new Date().getFullYear()}
          disableFutureDates={true}
        />
        {errors.date_of_birth && (
          <p className="text-sm text-destructive">
            {errors.date_of_birth.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("completing")}
          </>
        ) : (
          t("completeProfile")
        )}
      </Button>
    </form>
  );
}
