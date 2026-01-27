"use client";

import { useState } from "react";
import { Doctor } from "@/types/user";
import { useDoctors } from "../../query/useDoctor.query";
import { DoctorListPresentational } from "./DoctorListPresentational";
import { DoctorDetailDialog } from "./DoctorDetailDialog";
import { AddDoctorDialog } from "./addDoctorForm/AddDoctorDialog";

export function DoctorListContainer() {
  const { data, isLoading } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const doctors = data?.data || [];

  return (
    <>
      <DoctorListPresentational
        doctors={doctors}
        isLoading={isLoading}
        onViewDoctor={setSelectedDoctor}
        onAddDoctor={() => setIsAddDialogOpen(true)}
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
