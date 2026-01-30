"use client";

import { useState } from "react";
import { Doctor } from "@/types/user";
import { useTranslations } from "next-intl";

import { DoctorListPresentational } from "./DoctorListPresentational";
import { DoctorDetailDialog } from "./DoctorDetailDialog";
import { useDoctors, useVerifyDoctor } from "../../query/useDoctors.query";
import { useToast } from "@/hooks/useToast";

export function DoctorListContainer() {
  const { data, isLoading } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);

  const { mutate: verifyDoctor } = useVerifyDoctor();
  const { toast } = useToast();
  const tAdmin = useTranslations("admin");

  const handleVerify = (id: string, isApproved: boolean) => {
    verifyDoctor(
      { id, isVerified: isApproved },
      {
        onSuccess: () => {
          toast({
            title: isApproved ? tAdmin("verifySuccess") : tAdmin("rejectSuccess"),
            variant: isApproved ? "default" : "destructive",
          });
        },
      }
    );
  };

  const doctors = data?.data || [];
  
  const filteredDoctors = showUnverifiedOnly 
    ? doctors.filter(doc => doc.doctor?.account_status !== 'APPROVED')
    : doctors;

  return (
    <>
      <DoctorListPresentational
        doctors={filteredDoctors}
        isLoading={isLoading}
        onViewDoctor={setSelectedDoctor}
        showUnverifiedOnly={showUnverifiedOnly}
        setShowUnverifiedOnly={setShowUnverifiedOnly}
        onVerify={handleVerify}
      />

      {selectedDoctor && (
        <DoctorDetailDialog
          doctor={selectedDoctor}
          open={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </>
  );
}
