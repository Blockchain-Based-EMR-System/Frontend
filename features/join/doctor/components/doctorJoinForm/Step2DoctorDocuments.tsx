"use client";

import { UseFormReturn } from "react-hook-form";
import { DoctorJoinFormData } from "../../types/doctorJoinTypes";
import { FileUploadField } from "./FileUploadField";

interface Step2DoctorDocumentsProps {
  form: UseFormReturn<DoctorJoinFormData>;
  t: (key: string, values?: Record<string, any>) => string;
  isLoading: boolean;
}

export function Step2DoctorDocuments({
  form,
  t,
  isLoading,
}: Step2DoctorDocumentsProps) {
  const {
    formState: { errors },
    watch,
  } = form;

  const graduationCertificate = watch("graduationCertificate");
  const membershipCard = watch("membershipCard");
  const professionalPracticeCard = watch("professionalPracticeCard");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{t("step2Title")}</h2>
      </div>

      <div className="space-y-6">
        <FileUploadField
          name="graduationCertificate"
          label={t("graduationCertificate")}
          description={t("graduationCertificateDesc")}
          file={graduationCertificate}
          error={errors.graduationCertificate?.message}
          form={form}
          isLoading={isLoading}
        />

        <FileUploadField
          name="membershipCard"
          label={t("membershipCard")}
          description={t("membershipCardDesc")}
          file={membershipCard}
          error={errors.membershipCard?.message}
          form={form}
          isLoading={isLoading}
        />

        <FileUploadField
          name="professionalPracticeCard"
          label={t("professionalPracticeCard")}
          description={t("professionalPracticeCardDesc")}
          file={professionalPracticeCard}
          error={errors.professionalPracticeCard?.message}
          form={form}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
