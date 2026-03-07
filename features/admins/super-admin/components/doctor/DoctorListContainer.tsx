"use client";

import { useState, useMemo } from "react";
import { Doctor } from "@/types/user";
import { useDoctors } from "../../query/useDoctor.query";
import { DoctorListPresentational } from "./DoctorListPresentational";
import { DoctorDetailDialog } from "./DoctorDetailDialog";
import { AddDoctorDialog } from "./addDoctorForm/AddDoctorDialog";

const STATUS_ORDER: Record<string, number> = { PENDING: 0, APPROVED: 1, REJECTED: 2 };
const getStatusOrder = (status?: string): number => STATUS_ORDER[status ?? ""] ?? 3;

export function DoctorListContainer() {
  const { data, isLoading } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = useMemo(() => {
    const allDoctors = data?.data || [];
    const q = searchQuery.toLowerCase().trim();
    return allDoctors
      .filter((doc) => {
        if (q) return (doc.name?.toLowerCase().includes(q) ?? false) || (doc.phone?.toLowerCase().includes(q) ?? false);
        return true;
      })
      .sort((a, b) => getStatusOrder(a.doctor?.account_status) - getStatusOrder(b.doctor?.account_status));
  }, [data, searchQuery]);

  return (
    <>
      <DoctorListPresentational
        doctors={filteredDoctors}
        isLoading={isLoading}
        onViewDoctor={setSelectedDoctor}
        onAddDoctor={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {selectedDoctor && (
        <DoctorDetailDialog
          doctor={selectedDoctor}
          open={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

      <AddDoctorDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </>
  );
}
