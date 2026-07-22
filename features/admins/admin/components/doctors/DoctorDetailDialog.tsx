"use client";

import { useTranslations, useLocale } from "next-intl";
import { Doctor } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, isValid, parseISO } from "date-fns";
import {
  getAccountStatusBadge,
  getSpecializationDisplay,
} from "@/features/admins/utils";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DoctorDetailDialogProps {
  doctor: Doctor;
  open: boolean;
  onClose: () => void;
}

const formatSafeDate = (
  dateString?: string | null,
  formatStr: string = "PPpp",
) => {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : "N/A";
  } catch {
    return "N/A";
  }
};

export function DoctorDetailDialog({
  doctor,
  open,
  onClose,
}: DoctorDetailDialogProps) {
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("admin");
  const tFields = useTranslations("fields");
  const locale = useLocale();

  const handleViewDocument = (url: string | null | undefined) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const certificates = [
    {
      label: tAdmin("graduationCertificate"),
      url: doctor.doctor?.graduationCertificateUrl,
      filename: "graduation_certificate.pdf",
    },
    {
      label: tAdmin("membershipCard"),
      url: doctor.doctor?.membershipCardUrl,
      filename: "membership_card.pdf",
    },
    {
      label: tAdmin("professionalPracticeCard"),
      url: doctor.doctor?.professionalPracticeCardUrl,
      filename: "professional_practice_card.pdf",
    },
    {
      label: tAdmin("mastersCertificate"),
      url: doctor.doctor?.mastersCertificateUrl,
      filename: "masters_certificate.pdf",
    },
    {
      label: tAdmin("fellowshipCertificate"),
      url: doctor.doctor?.fellowshipCertificateUrl,
      filename: "fellowship_certificate.pdf",
    },
    {
      label: tAdmin("unionSpecializationCertificate"),
      url: doctor.doctor?.unionSpecializationCertificateUrl,
      filename: "union_specialization_certificate.pdf",
    },
  ];

  console.log("DoctorDetailDialog doctor:", doctor);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tAdmin("doctorDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("name")}
              </p>
              <p className="text-base">{doctor.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("email")}
              </p>
              <p className="text-base">{doctor.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("username")}
              </p>
              <p className="text-base">{doctor.username || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("phoneNumber")}
              </p>
              <p className="text-base">{doctor.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("gender")}
              </p>
              <p className="text-base">
                {doctor.gender === "MALE"
                  ? tFields("male")
                  : doctor.gender === "FEMALE"
                    ? tFields("female")
                    : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("dateOfBirth")}
              </p>
              <p className="text-base">
                {formatSafeDate(doctor.date_of_birth, "PP")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tAdmin("specialization")}
              </p>
              <p className="text-base">
                {getSpecializationDisplay(doctor, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("accountStatus")}
              </p>
              {getAccountStatusBadge(doctor.doctor?.account_status, tCommon)}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {tAdmin("certificates")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex gap-2">
                      <p className="text-sm font-medium lg:max-w-[80%]">{cert.label}</p>
                      {!cert.url && (
                        <p className="text-xs text-muted-foreground">
                          {tAdmin("notProvided")}
                        </p>
                      )}
                    </div>
                  </div>
                  {cert.url && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(cert.url)}
                      >
                        {tAdmin("viewDocument")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
