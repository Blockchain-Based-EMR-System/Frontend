"use client";

import { Clinic } from "../../types/clinic.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface ClinicDetailDialogProps {
  clinic: Clinic;
  open: boolean;
  onClose: () => void;
}

export function ClinicDetailDialog({
  clinic,
  open,
  onClose,
}: ClinicDetailDialogProps) {
  const tAdmin = useTranslations("admin");
  const tFields = useTranslations("fields");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tAdmin("clinicDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("name")}
              </p>
              <p className="text-base">{clinic.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("phoneNumber")}
              </p>
              <p className="text-base">{clinic.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tAdmin("status")}
              </p>
              <Badge variant={clinic.is_active ? "default" : "secondary"}>
                {clinic.is_active ? tAdmin("active") : tAdmin("inactive")}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tAdmin("onlinePayment")}
              </p>
              <Badge variant={clinic.canPayOnline ? "default" : "outline"}>
                {clinic.canPayOnline ? tAdmin("enabled") : tAdmin("disabled")}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tAdmin("openingTime")}
              </p>
              <p className="text-base">{clinic.opening_at}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tAdmin("closingTime")}
              </p>
              <p className="text-base">{clinic.closing_at}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {tFields("address")}
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <p className="text-base flex-1">{clinic.address}</p>
            </div>
            {clinic.address_maps_link && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open(clinic.address_maps_link, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {tAdmin("viewOnMap")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
