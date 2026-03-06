"use client";

import { useState } from "react";
import { useNurses } from "../../query/useNurse.query";
import { NurseListPresentational } from "./NurseListPresentational";
import { NurseDetailDialog } from "./NurseDetailDialog";
import { Nurse } from "../../types/nurseTypes";

export function NurseListContainer() {
  const { data, isLoading } = useNurses();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  const nurses = data?.data || [];

  return (
    <>
      <NurseListPresentational
        nurses={nurses}
        isLoading={isLoading}
        onViewNurse={setSelectedNurse}
      />

      {selectedNurse && (
        <NurseDetailDialog
          nurse={selectedNurse}
          open={!!selectedNurse}
          onClose={() => setSelectedNurse(null)}
        />
      )}
    </>
  );
}
