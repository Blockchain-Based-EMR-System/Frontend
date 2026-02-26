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
import { useCancelAppointment } from "../../query/useDashboard.query";
import { AlertTriangle, Loader2 } from "lucide-react";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  tDashboard: (key: string) => string;
  tCommon: (key: string) => string;
}

export function CancelAppointmentModal({
  isOpen,
  onClose,
  appointmentId,
  tDashboard,
  tCommon,
}: CancelAppointmentModalProps) {
  const cancelMutation = useCancelAppointment();

  const handleCancel = () => {
    cancelMutation.mutate(appointmentId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {tDashboard("cancelAppointment")}
          </DialogTitle>
          <DialogDescription>
            {tDashboard("cancelAppointmentConfirm")}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {tDashboard("cancelAppointmentWarning")}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={cancelMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {tDashboard("cancelling")}
              </>
            ) : (
              tDashboard("cancel")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
