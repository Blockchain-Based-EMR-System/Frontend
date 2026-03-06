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
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmStatusChangeDialogProps {
  clinic: Clinic;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function ConfirmStatusChangeDialog({
  clinic,
  open,
  onClose,
  onConfirm,
  isPending = false,
}: ConfirmStatusChangeDialogProps) {
  const tAdmin = useTranslations("admin");
  const tCommon = useTranslations("common");

  const newStatus = !clinic.is_active;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isPending) onClose();
      }}
    >
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
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant={newStatus ? "default" : "destructive"}
            className="flex-1"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {newStatus ? tAdmin("activate") : tAdmin("deactivate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
