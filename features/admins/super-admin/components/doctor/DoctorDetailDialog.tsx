"use client";

import { useLocale } from "next-intl";
import { Doctor } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, isValid, parseISO } from "date-fns";
import {
  SPECIALIZATIONS,
} from "@/constants/specializations";

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
  const locale = useLocale();
  const isArabic = locale === "ar";

  const getSpecializationDisplay = (doctor: Doctor) => {
    if (!doctor.doctor?.specialization) return "N/A";
    const key = doctor.doctor.specialization.key;
    if (key && SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS]) {
      return isArabic
        ? SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS].ar
        : SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS].en;
    }
    return doctor.doctor.specialization.value || "N/A";
  };

  const getAccountStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="warning">Unknown</Badge>;

    switch (status.toUpperCase()) {
      case "APPROVED":
        return <Badge variant="success">Approved</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doctor Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{doctor.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{doctor.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Username
              </p>
              <p className="text-sm">{doctor.username || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{doctor.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Gender
              </p>
              <p className="text-sm">{doctor.gender || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date of Birth
              </p>
              <p className="text-sm">
                {formatSafeDate(doctor.date_of_birth, "PP")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Specialization
              </p>
              <p className="text-sm">{getSpecializationDisplay(doctor)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Time
              </p>
              <p className="text-sm">{doctor.doctor?.avg_time || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge variant="info">{doctor.role || "DOCTOR"}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Account Status
              </p>
              {getAccountStatusBadge(doctor.doctor?.account_status)}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Verification Status
              </p>
              <Badge variant={doctor.isVerified ? "success" : "warning"}>
                {doctor.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Profile Status
              </p>
              <Badge
                variant={doctor.hasCompletedProfile ? "success" : "warning"}
              >
                {doctor.hasCompletedProfile ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p className="text-sm">{formatSafeDate(doctor.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Updated At
              </p>
              <p className="text-sm">{formatSafeDate(doctor.updated_at)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
