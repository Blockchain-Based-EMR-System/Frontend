"use client";

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
import { MedicalHistoryRecord } from "../../types/medicalHistory.types";

interface DeleteMedicalHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  record: MedicalHistoryRecord | null;
  isPending: boolean;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}

export function DeleteMedicalHistoryDialog({
  open,
  onClose,
  onConfirm,
  record,
  isPending,
  tMedicalHistory,
  tCommon,
}: DeleteMedicalHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {tMedicalHistory("deleteDialogTitle")}
          </DialogTitle>
          <DialogDescription>
            {tMedicalHistory("deleteDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {record?.content.title || tMedicalHistory("record")}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tMedicalHistory("deleting")}
              </>
            ) : (
              tCommon("delete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
