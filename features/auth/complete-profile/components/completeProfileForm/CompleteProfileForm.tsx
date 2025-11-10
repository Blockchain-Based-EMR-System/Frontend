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
import { Loader2, Calendar } from "lucide-react";
import { createCompleteProfileSchema } from "./CompleteProfileSchema";
import { useState } from "react";

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
  const t = useTranslations("");
  const [selectedGender, setSelectedGender] = useState<string>("");

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
        <div className="relative">
          <Input
            id="date_of_birth"
            type="date"
            {...register("date_of_birth")}
            disabled={isLoading}
            aria-invalid={!!errors.date_of_birth}
            className="py-5"
            max={new Date().toISOString().split("T")[0]}
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
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
