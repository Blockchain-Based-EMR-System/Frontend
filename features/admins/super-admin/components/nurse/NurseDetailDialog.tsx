"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, User } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { getAccountStatusBadge } from "@/features/admins/utils";
import { Nurse } from "../../types/nurseTypes";

interface NurseDetailDialogProps {
  nurse: Nurse;
  open: boolean;
  onClose: () => void;
}

const formatSafeDate = (dateString?: string | null, formatStr = "PP") => {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : "N/A";
  } catch {
    return "N/A";
  }
};

export function NurseDetailDialog({
  nurse,
  open,
  onClose,
}: NurseDetailDialogProps) {
  const tAdmin = useTranslations("superAdmin");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");

  const handleViewDocument = (url: string | null | undefined) => {
    if (url) window.open(url, "_blank");
  };

  const documents = [
    { label: tAdmin("nationalCard"), url: nurse.nurse?.nationalCardUrl },
    { label: tAdmin("bonusFile"), url: nurse.nurse?.bonusFileUrl },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tAdmin("nurseDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {nurse.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={nurse.photo_url}
                  alt={nurse.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{nurse.name}</h3>
              <p className="text-muted-foreground text-sm">{nurse.email}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("name")}
              </p>
              <p className="text-base">{nurse.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("email")}
              </p>
              <p className="text-base">{nurse.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("phoneNumber")}
              </p>
              <p className="text-base">
                {nurse.phone || tAdmin("notProvided")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("gender")}
              </p>
              <p className="text-base">
                {nurse.gender === "MALE"
                  ? tFields("male")
                  : nurse.gender === "FEMALE"
                    ? tFields("female")
                    : tAdmin("notProvided")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("dateOfBirth")}
              </p>
              <p className="text-base">{formatSafeDate(nurse.date_of_birth)}</p>
            </div>
            {nurse.nurse?.years_of_experience != null && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tAdmin("yearsOfExperience")}
                </p>
                <p className="text-base">{nurse.nurse.years_of_experience}</p>
              </div>
            )}
            {nurse.nurse?.account_status && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tCommon("accountStatus")}
                </p>
                {getAccountStatusBadge(nurse.nurse.account_status, tCommon)}
              </div>
            )}
          </div>

          {/* Brief */}
          {nurse.nurse?.brief && (
            <div>
              <p className="font-medium text-muted-foreground text-sm mb-1">
                {tAdmin("brief")}
              </p>
              <p className="text-sm bg-muted p-3 rounded-md">
                {nurse.nurse.brief}
              </p>
            </div>
          )}

          {/* Documents */}
          <div className="border-t pt-6">
            <h3 className="text-base font-semibold mb-4">
              {tAdmin("certificates")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.label}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex gap-2">
                      <p className="text-sm font-medium">{doc.label}</p>
                      {!doc.url && (
                        <p className="text-xs text-muted-foreground">
                          {tAdmin("notProvided")}
                        </p>
                      )}
                    </div>
                  </div>
                  {doc.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc.url)}
                    >
                      {tAdmin("viewDocument")}
                    </Button>
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
