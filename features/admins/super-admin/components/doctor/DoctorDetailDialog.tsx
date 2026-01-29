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
import { getAccountStatusBadge, getSpecializationDisplay } from "@/features/admins/utils";



interface DoctorDetailDialogProps {
  doctor: Doctor;
  open: boolean;
  onClose: () => void;
}

const formatSafeDate = (
  dateString?: string | null,
  formatStr: string = "PPpp"
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
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tDoctor = useTranslations("doctor"); 
  const locale = useLocale();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tDoctor("doctorDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{tCommon("name")}</p>
              <p className="text-base">{doctor.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{tCommon("email")}</p>
              <p className="text-base">{doctor.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("username")}
              </p>
              <p className="text-base">{doctor.username || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{tCommon("phone")}</p>
              <p className="text-base">{doctor.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("gender")}
              </p>
              <p className="text-base">{doctor.gender === "MALE" ? tAuth("male") : doctor.gender === "FEMALE" ? tAuth("female") : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("dateOfBirth")}
              </p>
              <p className="text-base">
                {formatSafeDate(doctor.date_of_birth, "PP")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tDoctor("specialization")}
              </p>
              <p className="text-base">{getSpecializationDisplay(doctor, locale)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("accountStatus")}
              </p>
              {getAccountStatusBadge(doctor.doctor?.account_status, tCommon)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
