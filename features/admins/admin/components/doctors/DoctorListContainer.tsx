"use client";

import { useState, useMemo } from "react";
import { Doctor } from "@/types/user";
import { useTranslations } from "next-intl";

import { DoctorListPresentational } from "./DoctorListPresentational";
import { DoctorDetailDialog } from "./DoctorDetailDialog";
import { ConfirmVerificationDialog } from "./ConfirmVerificationDialog";
import { useDoctors, useVerifyDoctor } from "../../query/useDoctors.query";
import { useToast } from "@/hooks/useToast";

const STATUS_ORDER: Record<string, number> = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};
const getStatusOrder = (status?: string): number =>
  STATUS_ORDER[status ?? ""] ?? 3;

export function DoctorListContainer() {
  const { data, isLoading } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorToVerify, setDoctorToVerify] = useState<{
    doctor: Doctor;
    action: "verify" | "reject";
  } | null>(null);

  const { mutate: verifyDoctor, isPending: isVerifyPending } =
    useVerifyDoctor();
  const { toast } = useToast();
  const tAdmin = useTranslations("admin");

  const handleVerifyClick = (doctor: Doctor, action: "verify" | "reject") => {
    setDoctorToVerify({ doctor, action });
  };

  const confirmVerification = () => {
    if (!doctorToVerify) return;

    const isApproved = doctorToVerify.action === "verify";

    verifyDoctor(
      { id: doctorToVerify.doctor.id, isVerified: isApproved },
      {
        onSuccess: () => {
          toast({
            title: isApproved
              ? tAdmin("verifySuccess")
              : tAdmin("rejectSuccess"),
            variant: isApproved ? "default" : "destructive",
          });
          setDoctorToVerify(null);
        },
        onError: () => {
          toast({
            title: tAdmin("verificationError"),
            variant: "destructive",
          });
        },
      },
    );
  };

  const filteredDoctors = useMemo(() => {
    const allDoctors = data?.data || [];
    const q = searchQuery.toLowerCase().trim();
    return allDoctors
      .filter((doc) => {
        if (showUnverifiedOnly && doc.doctor?.account_status === "APPROVED")
          return false;
        if (q)
          return (
            (doc.name?.toLowerCase().includes(q) ?? false) ||
            (doc.phone?.toLowerCase().includes(q) ?? false)
          );
        return true;
      })
      .sort(
        (a, b) =>
          getStatusOrder(a.doctor?.account_status) -
          getStatusOrder(b.doctor?.account_status),
      );
  }, [data, showUnverifiedOnly, searchQuery]);

  return (
    <>
      <DoctorListPresentational
        doctors={filteredDoctors}
        isLoading={isLoading}
        onViewDoctor={setSelectedDoctor}
        showUnverifiedOnly={showUnverifiedOnly}
        setShowUnverifiedOnly={setShowUnverifiedOnly}
        onVerifyClick={handleVerifyClick}
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

      {doctorToVerify && (
        <ConfirmVerificationDialog
          doctor={doctorToVerify.doctor}
          action={doctorToVerify.action}
          open={!!doctorToVerify}
          onClose={() => setDoctorToVerify(null)}
          onConfirm={confirmVerification}
          isPending={isVerifyPending}
        />
      )}
    </>
  );
}
