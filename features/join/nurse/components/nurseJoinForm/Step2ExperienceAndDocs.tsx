"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NurseJoinFormData } from "../../types/nurseJoinTypes";
import { FileUploadField } from "./FileUploadField";
import { useTranslations } from "next-intl";

interface Step2ExperienceAndDocsProps {
  form: UseFormReturn<NurseJoinFormData>;
  tNurse: (key: string, values?: Record<string, any>) => string;
  isLoading: boolean;
}

export function Step2ExperienceAndDocs({
  form,
  tNurse,
  isLoading,
}: Step2ExperienceAndDocsProps) {
  const tFields = useTranslations("fields");
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const nationalCard = watch("nationalCard");
  const bonusFile = watch("bonusFile");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{tNurse("step2Title")}</h2>
      </div>

      <div className="space-y-6">
        {/* Years of Experience */}
        <div className="space-y-2">
          <Input
            id="yearsOfExperience"
            type="number"
            min={0}
            max={50}
            placeholder={tNurse("yearsOfExperiencePlaceholder")}
            {...register("yearsOfExperience", { valueAsNumber: true })}
            disabled={isLoading}
            className="py-5"
          />
          {errors.yearsOfExperience && (
            <p className="text-sm text-destructive">
              {errors.yearsOfExperience.message}
            </p>
          )}
        </div>

        {/* Brief / Bio */}
        <div className="space-y-2">
          <Textarea
            id="brief"
            placeholder={tNurse("briefPlaceholder")}
            rows={3}
            {...register("brief")}
            disabled={isLoading}
            className="resize-none"
          />
          {errors.brief && (
            <p className="text-sm text-destructive">{errors.brief.message}</p>
          )}
        </div>

        {/* National Card — required */}
        <FileUploadField
          name="nationalCard"
          label={tNurse("nationalCard")}
          description={tNurse("nationalCardDesc")}
          file={nationalCard}
          error={errors.nationalCard?.message}
          form={form}
          isLoading={isLoading}
        />

        {/* Bonus File — optional */}
        <FileUploadField
          name="bonusFile"
          label={tNurse("bonusFile")}
          description={tNurse("bonusFileDesc")}
          file={bonusFile}
          error={errors.bonusFile?.message as string | undefined}
          form={form}
          isLoading={isLoading}
          optional
        />
      </div>
    </div>
  );
}
