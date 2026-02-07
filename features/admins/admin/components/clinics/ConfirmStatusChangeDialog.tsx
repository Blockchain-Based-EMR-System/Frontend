"use client";

import { useTranslations } from "next-intl";
import { Clinic } from "../../types/clinic.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmStatusChangeDialogProps {
  clinic: Clinic;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmStatusChangeDialog({
  clinic,
  open,
  onClose,
  onConfirm,
}: ConfirmStatusChangeDialogProps) {
  const tAdmin = useTranslations("admin");
  const tCommon = useTranslations("common");

  const newStatus = !clinic.is_active;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>
              {newStatus
                ? tAdmin("confirmActivate")
                : tAdmin("confirmDeactivate")}
            </DialogTitle>
          </div>
          <DialogDescription>
            {newStatus
              ? tAdmin("activateMessage")
              : tAdmin("deactivateMessage")}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium">{clinic.name}</p>
          <p className="text-sm text-muted-foreground">{clinic.address}</p>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant={newStatus ? "default" : "destructive"}
            className="flex-1"
          >
            {newStatus ? tAdmin("activate") : tAdmin("deactivate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
