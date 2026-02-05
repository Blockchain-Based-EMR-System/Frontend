"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useDeleteClinic } from "../../query/useClinics.query";
import { Clinic } from "../../types/clinic.types";

interface DeleteClinicDialogPresentationalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  clinicName: string;
}

function DeleteClinicDialogPresentational({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  clinicName,
}: DeleteClinicDialogPresentationalProps) {
  const t = useTranslations("doctorDashboard.clinicForm");
  const tCommon = useTranslations("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
          </div>
          <DialogDescription className="space-y-2 pt-2">
            {t("deleteConfirmation")}
            <span className="font-medium text-foreground block">{clinicName}</span>
            <span className="text-sm text-destructive block">{t("deleteWarning")}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? tCommon("deleting") : t("deleteClinic")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteClinicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinic: Clinic;
}

export function DeleteClinicDialog({
  open,
  onOpenChange,
  clinic,
}: DeleteClinicDialogProps) {
  const deleteClinic = useDeleteClinic();

  const handleConfirm = () => {
    deleteClinic.mutate(clinic.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <DeleteClinicDialogPresentational
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
      isLoading={deleteClinic.isPending}
      clinicName={clinic.name}
    />
  );
}
