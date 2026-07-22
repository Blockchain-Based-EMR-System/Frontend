"use client";

import { useState } from "react";
import { ClinicCardPresentational } from "./ClinicCardPresentational";
import { EditClinicDialog } from "./EditClinicDialog";
import { EditClinicFeesDialog } from "./EditClinicFeesDialog";
import { DeleteClinicDialog } from "./DeleteClinicDialog";
import { Clinic } from "../../types/clinic.types";

interface ClinicCardProps {
  clinic: Clinic;
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <ClinicCardPresentational
        clinic={clinic}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />
      {clinic.isOwner ? (
        <>
          <EditClinicDialog
            clinic={clinic}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />
          <DeleteClinicDialog
            clinic={clinic}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </>
      ) : (
        <EditClinicFeesDialog
          clinic={clinic}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
  );
}
