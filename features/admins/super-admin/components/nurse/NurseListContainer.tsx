"use client";

import { useState, useMemo } from "react";
import { useNurses } from "../../query/useNurse.query";
import { NurseListPresentational } from "./NurseListPresentational";
import { NurseDetailDialog } from "./NurseDetailDialog";
import { Nurse } from "../../types/nurseTypes";

const STATUS_ORDER: Record<string, number> = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};
const getStatusOrder = (status?: string): number =>
  STATUS_ORDER[status ?? ""] ?? 3;

export function NurseListContainer() {
  const { data, isLoading } = useNurses();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNurses = useMemo(() => {
    const allNurses = data?.data || [];
    const q = searchQuery.toLowerCase().trim();
    return allNurses
      .filter((n) => {
        if (q)
          return (
            (n.name?.toLowerCase().includes(q) ?? false) ||
            (n.phone?.toLowerCase().includes(q) ?? false)
          );
        return true;
      })
      .sort(
        (a, b) =>
          getStatusOrder(a.nurse?.account_status) -
          getStatusOrder(b.nurse?.account_status),
      );
  }, [data, searchQuery]);

  return (
    <>
      <NurseListPresentational
        nurses={filteredNurses}
        isLoading={isLoading}
        onViewNurse={setSelectedNurse}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
