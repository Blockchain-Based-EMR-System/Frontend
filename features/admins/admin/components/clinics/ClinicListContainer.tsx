"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Clinic } from "../../types/clinic.types";
import {
  useClinics,
  useSetClinicActiveStatus,
} from "../../query/useClinics.query";
import { ClinicListPresentational } from "./ClinicListPresentational";
import { ClinicDetailDialog } from "./ClinicDetailDialog";
import { ConfirmStatusChangeDialog } from "./ConfirmStatusChangeDialog";
import { useToast } from "@/hooks/useToast";

export function ClinicListContainer() {
  const { data, isLoading } = useClinics();
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinicToToggle, setClinicToToggle] = useState<Clinic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);

  const { mutate: setActiveStatus, isPending: isStatusPending } =
    useSetClinicActiveStatus();
  const { toast } = useToast();
  const tAdmin = useTranslations("admin");

  const handleToggleStatus = (clinic: Clinic) => {
    setClinicToToggle(clinic);
  };

  const confirmToggleStatus = () => {
    if (!clinicToToggle) return;

    const newStatus = !clinicToToggle.is_active;

    setActiveStatus(
      { id: clinicToToggle.id, isActive: newStatus },
      {
        onSuccess: () => {
          toast({
            title: newStatus
              ? tAdmin("activateSuccess")
              : tAdmin("deactivateSuccess"),
            variant: "default",
          });
          setClinicToToggle(null);
        },
        onError: () => {
          toast({
            title: tAdmin("statusChangeError"),
            variant: "destructive",
          });
        },
      },
    );
  };

  const filteredClinics = useMemo(() => {
    const allClinics = data?.data || [];
    const q = searchQuery.toLowerCase().trim();
    return allClinics.filter((c) => {
      if (showInactiveOnly && c.is_active) return false;
      if (q) return (c.name?.toLowerCase().includes(q) ?? false) || (c.phone?.toLowerCase().includes(q) ?? false);
      return true;
    });
  }, [data, searchQuery, showInactiveOnly]);

  return (
    <>
      <ClinicListPresentational
        clinics={filteredClinics}
        isLoading={isLoading}
        onViewClinic={setSelectedClinic}
        onToggleStatus={handleToggleStatus}
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

      {clinicToToggle && (
        <ConfirmStatusChangeDialog
          clinic={clinicToToggle}
          open={!!clinicToToggle}
          onClose={() => setClinicToToggle(null)}
          onConfirm={confirmToggleStatus}
          isPending={isStatusPending}
        />
      )}
    </>
  );
}
