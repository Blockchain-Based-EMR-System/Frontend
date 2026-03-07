"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

import { NurseListPresentational } from "./NurseListPresentational";
import { NurseDetailDialog } from "./NurseDetailDialog";
import { ConfirmNurseVerificationDialog } from "./ConfirmNurseVerificationDialog";
import { useAllNurses, useVerifyNurse } from "../../query/useNurses.query";
import { useToast } from "@/hooks/useToast";
import { Nurse } from "../../types/nurse.types";

const STATUS_ORDER: Record<string, number> = { PENDING: 0, APPROVED: 1, REJECTED: 2 };
const getStatusOrder = (status?: string): number => STATUS_ORDER[status ?? ""] ?? 3;

export function NurseListContainer() {
  const { data, isLoading } = useAllNurses();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nurseToVerify, setNurseToVerify] = useState<{
    nurse: Nurse;
    action: "verify" | "reject";
  } | null>(null);

  const { mutate: verifyNurse, isPending: isVerifyPending } = useVerifyNurse();
  const { toast } = useToast();
  const tAdmin = useTranslations("admin");

  const handleVerifyClick = (nurse: Nurse, action: "verify" | "reject") => {
    setNurseToVerify({ nurse, action });
  };

  const confirmVerification = () => {
    if (!nurseToVerify) return;

    const isApproved = nurseToVerify.action === "verify";

    verifyNurse(
      { id: nurseToVerify.nurse.id, isVerified: isApproved },
      {
        onSuccess: () => {
          toast({
            title: isApproved
              ? tAdmin("verifyNurseSuccess")
              : tAdmin("rejectNurseSuccess"),
            variant: isApproved ? "default" : "destructive",
          });
          setNurseToVerify(null);
        },
        onError: () => {
          toast({
            title: tAdmin("nurseVerificationError"),
            variant: "destructive",
          });
        },
      },
    );
  };

  const filteredNurses = useMemo(() => {
    const allNurses = data?.data || [];
    const q = searchQuery.toLowerCase().trim();
    return allNurses
      .filter((n) => {
        if (showUnverifiedOnly && n.nurse?.account_status === "APPROVED") return false;
        if (q) return (n.name?.toLowerCase().includes(q) ?? false) || (n.phone?.toLowerCase().includes(q) ?? false);
        return true;
      })
      .sort((a, b) => getStatusOrder(a.nurse?.account_status) - getStatusOrder(b.nurse?.account_status));
  }, [data, showUnverifiedOnly, searchQuery]);

  return (
    <>
      <NurseListPresentational
        nurses={filteredNurses}
        isLoading={isLoading}
        onViewNurse={setSelectedNurse}
        showUnverifiedOnly={showUnverifiedOnly}
        setShowUnverifiedOnly={setShowUnverifiedOnly}
        onVerifyClick={handleVerifyClick}
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

      {nurseToVerify && (
        <ConfirmNurseVerificationDialog
          nurse={nurseToVerify.nurse}
          action={nurseToVerify.action}
          open={!!nurseToVerify}
          onClose={() => setNurseToVerify(null)}
          onConfirm={confirmVerification}
          isPending={isVerifyPending}
        />
      )}
    </>
  );
}
