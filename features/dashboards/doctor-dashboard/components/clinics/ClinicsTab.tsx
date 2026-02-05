"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Building2 } from "lucide-react";
import { ClinicCard } from "./ClinicCard";
import { CreateClinicDialog } from "./CreateClinicDialog";
import { Clinic } from "../../types/clinic.types";

interface ClinicsTabPresentationalProps {
  clinics: Clinic[];
  isLoading: boolean;
  onAddNew: () => void;
}

function ClinicsTabPresentational({
  clinics,
  isLoading,
  onAddNew,
}: ClinicsTabPresentationalProps) {
  const t = useTranslations("doctorDashboard.clinics");
  const tCommon = useTranslations("common");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{tCommon("loading")}</p>
      </div>
    );
  }

  if (!clinics || clinics.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Building2 className="h-16 w-16 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{t("noClinics")}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {t("createFirst")}
            </p>
          </div>
          <Button onClick={onAddNew} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            {t("addNew")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
        </div>
        <Button onClick={onAddNew}>
          <Plus className="h-5 w-5 mr-2" />
          {t("addNew")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <ClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>
    </div>
  );
}

interface ClinicsTabProps {
  clinics: Clinic[];
  isLoading: boolean;
}

export function ClinicsTab({ clinics, isLoading }: ClinicsTabProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <ClinicsTabPresentational
        clinics={clinics}
        isLoading={isLoading}
        onAddNew={() => setIsCreateOpen(true)}
      />
      <CreateClinicDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
