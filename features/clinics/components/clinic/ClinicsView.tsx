"use client";

import { useTranslations } from "next-intl";
import { parseAsBoolean, useQueryStates } from "nuqs";
import { useClinics } from "../../query/appointments.query";
import { ClinicCard } from "./ClinicCard";
import { ClinicCardSkeleton } from "../../skeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ClinicsView() {
  const t = useTranslations("clinics");
  const [filters] = useQueryStates({
    canPayOnline: parseAsBoolean,
  });

  const { data, isLoading, isError } = useClinics({
    canPayOnline: filters.canPayOnline ?? undefined,
  });

  const clinics = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <ClinicCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("errors.loadingClinics")}. {t("errors.tryAgain")}
        </AlertDescription>
      </Alert>
    );
  }

  if (clinics.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {filters.canPayOnline !== null
            ? t("noResultsWithFilters")
            : t("noClinicsFound")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {clinics.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} />
      ))}
    </div>
  );
}
