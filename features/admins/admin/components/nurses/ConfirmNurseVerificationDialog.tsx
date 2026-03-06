"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Nurse } from "../../types/nurse.types";

interface ConfirmNurseVerificationDialogProps {
  nurse: Nurse;
  action: "verify" | "reject";
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function ConfirmNurseVerificationDialog({
  nurse,
  action,
  open,
  onClose,
  onConfirm,
  isPending = false,
}: ConfirmNurseVerificationDialogProps) {
  const tAdmin = useTranslations("admin");
  const tCommon = useTranslations("common");

  const isVerify = action === "verify";

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
            {isVerify ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
            <DialogTitle>
              {isVerify
                ? tAdmin("confirmVerifyNurse")
                : tAdmin("confirmRejectNurse")}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isVerify
              ? tAdmin("verifyNurseMessage")
              : tAdmin("rejectNurseMessage")}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium">{nurse.name}</p>
          <p className="text-sm text-muted-foreground">{nurse.email}</p>
          {nurse.phone && (
            <p className="text-sm text-muted-foreground">{nurse.phone}</p>
          )}
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
            variant={isVerify ? "default" : "destructive"}
            className="flex-1"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isVerify ? tAdmin("verify") : tAdmin("reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
