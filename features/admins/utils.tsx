import { Doctor } from "@/types/user";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { Badge } from "@/components/ui/badge";

export const getSpecializationDisplay = (doctor: Doctor, locale: string) => {
  if (!doctor.doctor?.specialization) return "N/A";
  const key = doctor.doctor.specialization.key;
  const isArabic = locale === "ar";

  if (key && SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS]) {
    return isArabic
      ? SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS].ar
      : SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS].en;
  }
  return doctor.doctor.specialization.value || "N/A";
};

export const getAccountStatusBadge = (
  status: string | undefined,
  tCommon: (key: string) => string,
) => {
  if (!status) return <Badge variant="warning">{tCommon("unknown")}</Badge>;

  switch (status.toUpperCase()) {
    case "APPROVED":
      return <Badge variant="success">{tCommon("approved")}</Badge>;
    case "PENDING":
      return <Badge variant="warning">{tCommon("pending")}</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">{tCommon("rejected")}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
