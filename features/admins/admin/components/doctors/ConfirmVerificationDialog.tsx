"use client";

import { useTranslations } from "next-intl";
import { Doctor } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ConfirmVerificationDialogProps {
  doctor: Doctor;
  action: "verify" | "reject";
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmVerificationDialog({
  doctor,
  action,
  open,
  onClose,
  onConfirm,
}: ConfirmVerificationDialogProps) {
  const tAdmin = useTranslations("admin");
  const tCommon = useTranslations("common");

  const isVerify = action === "verify";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isVerify ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
            <DialogTitle>
              {isVerify ? tAdmin("confirmVerify") : tAdmin("confirmReject")}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isVerify ? tAdmin("verifyMessage") : tAdmin("rejectMessage")}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium">{doctor.name}</p>
          <p className="text-sm text-muted-foreground">{doctor.email}</p>
          {doctor.phone && (
            <p className="text-sm text-muted-foreground">{doctor.phone}</p>
          )}
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
            variant={isVerify ? "default" : "destructive"}
            className="flex-1"
          >
            {isVerify ? tAdmin("verify") : tAdmin("reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
