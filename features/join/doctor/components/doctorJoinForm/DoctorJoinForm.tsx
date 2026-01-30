"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DoctorJoinFormData } from "../../types/doctorJoinTypes";
import {
  createStep1Schema,
  createStep2Schema,
  createStep3Schema,
} from "./doctorJoinSchema";
import { Step1PersonalInfo } from "./Step1PersonalInfo";
import { Step2DoctorDocuments } from "./Step2DoctorDocuments";
import { Step3SpecializationDocs } from "./Step3SpecializationDocs";

interface DoctorJoinFormProps {
  onSubmit: (data: DoctorJoinFormData) => Promise<void>;
  isLoading: boolean;
  t: (key: string, values?: Record<string, any>) => string;
}

export function DoctorJoinForm({
  onSubmit,
  isLoading,
  t,
}: DoctorJoinFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<DoctorJoinFormData>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      gender: undefined,
      dateOfBirth: undefined,
      graduationCertificate: null,
      membershipCard: null,
      professionalPracticeCard: null,
      mastersCertificate: null,
      fellowshipCertificate: null,
      unionSpecializationCertificate: null,
    },
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    let schema;
    let fields: (keyof DoctorJoinFormData)[] = [];

    if (currentStep === 1) {
      schema = createStep1Schema(t);
      fields = [
        "fullName",
        "email",
        "phoneNumber",
        "password",
        "confirmPassword",
        "gender",
        "dateOfBirth",
      ];
    } else if (currentStep === 2) {
      schema = createStep2Schema(t);
      fields = [
        "graduationCertificate",
        "membershipCard",
        "professionalPracticeCard",
      ];
    } else if (currentStep === 3) {
      schema = createStep3Schema(t);
      fields = [
        "mastersCertificate",
        "fellowshipCertificate",
        "unionSpecializationCertificate",
      ];
    }

    if (!schema) return false;

    const values = form.getValues();
    const stepData: any = {};
    fields.forEach((field) => {
      stepData[field] = values[field];
    });

    try {
      await schema.parseAsync(stepData);
      return true;
    } catch (error) {
      await form.trigger(fields);
      return false;
    }
  };

  const handleNext = async () => {
    console.log("handleNext clicked, current step:", currentStep);
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
    console.log("🔵 Submit button clicked explicitly");

    const isStep3Valid = await validateCurrentStep();
    if (!isStep3Valid) {
      console.error("Step 3 validation failed - files not uploaded");
      return;
    }

    const data = form.getValues();
    console.log("Form data:", {
      fullName: data.fullName,
      email: data.email,
      gender: data.gender,
      graduationCertificate: data.graduationCertificate?.name,
      membershipCard: data.membershipCard?.name,
      professionalPracticeCard: data.professionalPracticeCard?.name,
      mastersCertificate: data.mastersCertificate?.name,
      fellowshipCertificate: data.fellowshipCertificate?.name,
      unionSpecializationCertificate: data.unionSpecializationCertificate?.name,
    });

    if (!data.gender || !data.dateOfBirth) {
      console.error("Missing required fields from step 1:", {
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
      });
      return;
    }

    const requiredFiles = [
      "graduationCertificate",
      "membershipCard",
      "professionalPracticeCard",
      "mastersCertificate",
      "fellowshipCertificate",
      "unionSpecializationCertificate",
    ] as const;

    const missingFiles = requiredFiles.filter((field) => !data[field]);
    if (missingFiles.length > 0) {
      console.error("❌ Missing files:", missingFiles);
      return;
    }

    console.log("🚀 All validation passed, submitting to API...");
    await onSubmit(data as DoctorJoinFormData);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    console.log(
      "=== FORM SUBMIT TRIGGERED (should not happen) ===",
      "Current Step:",
      currentStep,
    );
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("stepOf", { current: currentStep, total: totalSteps })}
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
          <Step1PersonalInfo form={form} t={t} isLoading={isLoading} />
        )}
        {currentStep === 2 && (
          <Step2DoctorDocuments form={form} t={t} isLoading={isLoading} />
        )}
        {currentStep === 3 && (
          <Step3SpecializationDocs form={form} t={t} isLoading={isLoading} />
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("previous")}
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1"
            >
              {t("next")}
              <ChevronRight className="h-4 w-4 ml-2" />
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
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
