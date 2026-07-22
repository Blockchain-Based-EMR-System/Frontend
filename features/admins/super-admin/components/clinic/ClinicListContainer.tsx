"use client";

import { useState, useMemo } from "react";
import { Clinic } from "../../types/clinicTypes";
import { useClinics } from "../../query/useClinic.query";
import { ClinicListPresentational } from "./ClinicListPresentational";
import { ClinicDetailDialog } from "./ClinicDetailDialog";

export function ClinicListContainer() {
  const { data, isLoading } = useClinics();
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);

  const filteredClinics = useMemo(() => {
    const allClinics = data?.data || [];
    const q = searchQuery.toLowerCase().trim();
    return allClinics.filter((c) => {
      if (showInactiveOnly && c.is_active) return false;
      if (q)
        return (
          (c.name?.toLowerCase().includes(q) ?? false) ||
          (c.phone?.toLowerCase().includes(q) ?? false)
        );
      return true;
    });
  }, [data, searchQuery, showInactiveOnly]);

  return (
    <>
      <ClinicListPresentational
        clinics={filteredClinics}
        isLoading={isLoading}
        onViewClinic={setSelectedClinic}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showInactiveOnly={showInactiveOnly}
        onShowInactiveOnlyChange={setShowInactiveOnly}
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
