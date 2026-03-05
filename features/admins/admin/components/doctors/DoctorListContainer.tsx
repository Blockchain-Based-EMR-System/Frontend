"use client";

import { useState } from "react";
import { Doctor } from "@/types/user";
import { useTranslations } from "next-intl";

import { DoctorListPresentational } from "./DoctorListPresentational";
import { DoctorDetailDialog } from "./DoctorDetailDialog";
import { ConfirmVerificationDialog } from "./ConfirmVerificationDialog";
import { useDoctors, useVerifyDoctor } from "../../query/useDoctors.query";
import { useToast } from "@/hooks/useToast";

export function DoctorListContainer() {
  const { data, isLoading } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
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

  const doctors = data?.data || [];

  const filteredDoctors = showUnverifiedOnly
    ? doctors.filter((doc) => doc.doctor?.account_status !== "APPROVED")
    : doctors;

  return (
    <>
      <DoctorListPresentational
        doctors={filteredDoctors}
        isLoading={isLoading}
        onViewDoctor={setSelectedDoctor}
        showUnverifiedOnly={showUnverifiedOnly}
        setShowUnverifiedOnly={setShowUnverifiedOnly}
        onVerifyClick={handleVerifyClick}
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
