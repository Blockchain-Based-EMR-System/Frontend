"use client";

import { Admin } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, isValid, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/LanguageProvider";

interface AdminDetailDialogProps {
  admin: Admin;
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

export function AdminDetailDialog({
  admin,
  open,
  onClose,
}: AdminDetailDialogProps) {

  const tAdmin = useTranslations("superAdmin");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tAdmin("adminDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{tCommon("name")}</p>
              <p className="text-base">{admin.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{tCommon("email")}</p>
              <p className="text-base">{admin.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("username")}
              </p>
              <p className="text-base">{admin.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{tCommon("phone")}</p>
              <p className="text-base">{admin.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("gender")}
              </p>
              <p className="text-base">{admin.gender === "MALE" ? tAuth("male") : admin.gender === "FEMALE" ? tAuth("female") : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tCommon("dateOfBirth")}
              </p>
              <p className="text-base">
                {formatSafeDate(admin.date_of_birth, "PP")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
