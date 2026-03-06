"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { NurseJoinFormData } from "../../types/nurseJoinTypes";
import {
  createStep1Schema,
  createStep2Schema,
  createNurseJoinSchema,
} from "./nurseJoinSchema";
import { Step1PersonalInfo } from "./Step1PersonalInfo";
import { Step2ExperienceAndDocs } from "./Step2ExperienceAndDocs";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useTranslations } from "next-intl";

interface NurseJoinFormProps {
  onSubmit: (data: NurseJoinFormData) => Promise<void>;
  isLoading: boolean;
  tNurse: (key: string, values?: Record<string, any>) => string;
  tCommon: (key: string, values?: Record<string, any>) => string;
  tFields: (key: string, values?: Record<string, any>) => string;
}

export function NurseJoinForm({
  onSubmit,
  isLoading,
  tNurse,
  tCommon,
  tFields,
}: NurseJoinFormProps) {
  const { locale } = useLanguage();
  const tFieldsHook = useTranslations("fields");
  const tNurseHook = useTranslations("nurseJoining");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const form = useForm<NurseJoinFormData>({
    resolver: zodResolver(createNurseJoinSchema(tFieldsHook, tNurseHook)),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      brief: "",
    } as any,
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    if (currentStep === 1) {
      const schema = createStep1Schema(tFieldsHook);
      const fields: (keyof NurseJoinFormData)[] = [
        "fullName",
        "email",
        "phoneNumber",
        "password",
        "confirmPassword",
        "gender",
        "dateOfBirth",
      ];
      const values = form.getValues();
      const stepData: Record<string, unknown> = {};
      fields.forEach((f) => (stepData[f] = values[f]));
      try {
        await schema.parseAsync(stepData);
        return true;
      } catch {
        await form.trigger(fields);
        return false;
      }
    }

    if (currentStep === 2) {
      const schema = createStep2Schema(tFieldsHook, tNurseHook);
      const fields: (keyof NurseJoinFormData)[] = [
        "yearsOfExperience",
        "brief",
        "nationalCard",
        "bonusFile",
      ];
      const values = form.getValues();
      const stepData: Record<string, unknown> = {};
      fields.forEach((f) => (stepData[f] = values[f]));
      try {
        await schema.parseAsync(stepData);
        return true;
      } catch {
        await form.trigger(fields);
        return false;
      }
    }

    return false;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitClick = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    const data = form.getValues();
    if (!data.gender || !data.dateOfBirth || !data.nationalCard) return;

    await onSubmit(data as NurseJoinFormData);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {tNurse("stepOf", {
              current: currentStep,
              total: totalSteps,
            })}
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index + 1 <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleFormSubmit}>
        {currentStep === 1 && (
          <Step1PersonalInfo
            form={form}
            tFields={tFields}
            isLoading={isLoading}
          />
        )}
        {currentStep === 2 && (
          <Step2ExperienceAndDocs
            form={form}
            tNurse={tNurse}
            isLoading={isLoading}
          />
        )}

        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="flex-1"
            >
              {locale === "ar" ? (
                <ChevronRight className="h-4 w-4 ml-2" />
              ) : (
                <ChevronLeft className="h-4 w-4 mr-2" />
              )}
              {tCommon("previous")}
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1"
            >
              {tCommon("next")}
              {locale === "ar" ? (
                <ChevronLeft className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmitClick}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tCommon("submitting")}
                </>
              ) : (
                tCommon("submit")
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
