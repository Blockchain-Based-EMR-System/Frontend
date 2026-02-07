"use client";

import { useState } from "react";
import { Clinic } from "../../types/clinicTypes";
import { useClinics } from "../../query/useClinic.query";
import { ClinicListPresentational } from "./ClinicListPresentational";
import { ClinicDetailDialog } from "./ClinicDetailDialog";

export function ClinicListContainer() {
  const { data, isLoading } = useClinics();
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const clinics = data?.data || [];

  return (
    <>
      <ClinicListPresentational
        clinics={clinics}
        isLoading={isLoading}
        onViewClinic={setSelectedClinic}
      />

      {selectedClinic && (
        <ClinicDetailDialog
          clinic={selectedClinic}
          open={!!selectedClinic}
          onClose={() => setSelectedClinic(null)}
        />
      )}
    </>
  );
}
