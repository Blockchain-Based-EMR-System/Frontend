"use client";

import { UseFormReturn } from "react-hook-form";
import { DoctorJoinFormData } from "../../types/doctorJoinTypes";
import { FileUploadField } from "./FileUploadField";

interface Step3SpecializationDocsProps {
  form: UseFormReturn<DoctorJoinFormData>;
  t: (key: string, values?: Record<string, any>) => string;
  isLoading: boolean;
}

export function Step3SpecializationDocs({
  form,
  t,
  isLoading,
}: Step3SpecializationDocsProps) {
  const {
    formState: { errors },
    watch,
  } = form;

  const mastersCertificate = watch("mastersCertificate");
  const fellowshipCertificate = watch("fellowshipCertificate");
  const unionSpecializationCertificate = watch(
    "unionSpecializationCertificate",
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{t("step3Title")}</h2>
      </div>

      <div className="space-y-6">
        <FileUploadField
          name="mastersCertificate"
          label={t("mastersCertificate")}
          description={t("mastersCertificateDesc")}
          file={mastersCertificate}
          error={errors.mastersCertificate?.message}
          form={form}
          isLoading={isLoading}
        />

        <FileUploadField
          name="fellowshipCertificate"
          label={t("fellowshipCertificate")}
          description={t("fellowshipCertificateDesc")}
          file={fellowshipCertificate}
          error={errors.fellowshipCertificate?.message}
          form={form}
          isLoading={isLoading}
        />

        <FileUploadField
          name="unionSpecializationCertificate"
          label={t("unionSpecializationCertificate")}
          description={t("unionSpecializationCertificateDesc")}
          file={unionSpecializationCertificate}
          error={errors.unionSpecializationCertificate?.message}
          form={form}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
