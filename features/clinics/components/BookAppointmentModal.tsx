"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DoctorWithClinics,
  Clinic,
  TimeSlot,
} from "../types/appointments.types";
import { useBookAppointment } from "../query/appointments.query";
import { Loader2, Calendar, Clock, Video, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getTimeIn12HourFormat } from "@/lib/helpers";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorWithClinics;
  clinic: Clinic | null;
  selectedDate: string;
  selectedSlot: TimeSlot;
}

export function BookAppointmentModal({
  isOpen,
  onClose,
  doctor,
  clinic,
  selectedDate,
  selectedSlot,
}: BookAppointmentModalProps) {
  const t = useTranslations("clinics.bookingModal");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");
  const { locale } = useLanguage();
  const router = useRouter();
  const bookMutation = useBookAppointment();

  const isOnline = !clinic;

  const handleConfirm = async () => {
    try {
      const [hours, minutes] = selectedSlot.start.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours) + 2, parseInt(minutes), 0, 0);

      const bookingData = {
        doctorId: doctor.id,
        clinicId: clinic?.id || null,
        scheduledTime: dateTime.toISOString(),
      };

      console.log(
        "📅 Booking Appointment - Data being sent to backend:",
        bookingData,
      );

      await bookMutation.mutateAsync(bookingData);

      onClose();
      router.push("/dashboard");
    } catch (error) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("confirmMessage")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              {t("doctorLabel")}
            </div>
            <div className="text-base font-semibold">{doctor.name}</div>
            <div className="text-sm text-muted-foreground">
              {tFields("specialization")}: {doctor.specialization}
            </div>
          </div>

          {clinic && (
            <>
              <Separator />
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {t("clinicLabel")}
                </div>
                <div className="text-base font-semibold">{clinic.name}</div>
                <div className="text-sm text-muted-foreground">
                  {clinic.address}
                </div>
              </div>
            </>
          )}

            {isOnline && (
              <>
              <Separator />
              <div className="flex items-center gap-2 text-primary p-2 rounded-md bg-primary/10">
                <Video className="h-4 w-4" />
                <p>{t("onlineConsultation")}</p>
              </div>
              </>
            )}

          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("dateLabel")}
              </div>
              <div className="text-base font-semibold">
                {format(new Date(selectedDate), "PP", {
                  locale: locale === "ar" ? ar : undefined,
                })}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("timeLabel")}
              </div>
              <div className="text-base font-semibold">
                <span>
                  {getTimeIn12HourFormat(selectedSlot.start, locale)}
                </span>
                {" - "}
                <span>{getTimeIn12HourFormat(selectedSlot.end, locale)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
            <div className="text-sm font-medium flex items-center gap-2">
              {t("feesLabel")}
            </div>
            <div className="text-lg font-bold">
              {doctor.fees} {tCommon("egp")}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={bookMutation.isPending}
            className="w-full sm:w-auto"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={bookMutation.isPending}
            className="w-full sm:w-auto"
          >
            {bookMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("booking")}
              </>
            ) : (
              t("confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
