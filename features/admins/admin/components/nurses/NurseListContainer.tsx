"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { NurseListPresentational } from "./NurseListPresentational";
import { NurseDetailDialog } from "./NurseDetailDialog";
import { ConfirmNurseVerificationDialog } from "./ConfirmNurseVerificationDialog";
import { useAllNurses, useVerifyNurse } from "../../query/useNurses.query";
import { useToast } from "@/hooks/useToast";
import { Nurse } from "../../types/nurse.types";

export function NurseListContainer() {
  const { data, isLoading } = useAllNurses();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
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

  const nurses = data?.data || [];

  const filteredNurses = showUnverifiedOnly
    ? nurses.filter((n) => n.nurse?.account_status !== "APPROVED")
    : nurses;

  return (
    <>
      <NurseListPresentational
        nurses={filteredNurses}
        isLoading={isLoading}
        onViewNurse={setSelectedNurse}
        showUnverifiedOnly={showUnverifiedOnly}
        setShowUnverifiedOnly={setShowUnverifiedOnly}
        onVerifyClick={handleVerifyClick}
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
