"use client";

import { useTranslations } from "next-intl";
import {
  parseAsStringEnum,
  parseAsInteger,
  parseAsBoolean,
  useQueryStates,
} from "nuqs";
import { useDoctors } from "../query/appointments.query";
import { DoctorCard } from "./DoctorCard";
import { DoctorCardSkeleton } from "../skeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function DoctorsView() {
  const t = useTranslations("clinics");
  const [filters] = useQueryStates({
    gender: parseAsStringEnum<"MALE" | "FEMALE">(["MALE", "FEMALE"]),
    minFees: parseAsInteger,
    maxFees: parseAsInteger,
    isOnline: parseAsBoolean,
  });

  const { data, isLoading, isError } = useDoctors({
    gender: filters.gender || undefined,
    minFees: filters.minFees || undefined,
    maxFees: filters.maxFees || undefined,
    isOnline: filters.isOnline ?? undefined,
  });

  const doctors = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("errors.loadingDoctors")}. {t("errors.tryAgain")}
        </AlertDescription>
      </Alert>
    );
  }

  if (doctors.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {filters.gender ||
          filters.minFees ||
          filters.maxFees ||
          filters.isOnline !== null
            ? t("noResultsWithFilters")
            : t("noDoctorsFound")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
