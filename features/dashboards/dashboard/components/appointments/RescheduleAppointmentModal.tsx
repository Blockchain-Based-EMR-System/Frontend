"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRescheduleAppointment } from "../../query/useDashboard.query";
import {
  useAvailableDays,
  useAvailableSlots,
} from "@/features/clinics/query/appointments.query";
import { Appointment } from "../../types/dashboardTypes";
import { TimeSlot } from "@/features/clinics/types/appointments.types";
import {
  Calendar,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useTranslations } from "next-intl";
import { getTimeIn12HourFormat, buildLocalISOString } from "@/lib/helpers";
import { RescheduleDatesSkeleton, RescheduleSlotsSkeleton } from "../skeletons";

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  tDashboard: (key: string) => string;
  tCommon: (key: string) => string;
}

export function RescheduleAppointmentModal({
  isOpen,
  onClose,
  appointment,
  tDashboard,
  tCommon,
}: RescheduleAppointmentModalProps) {
  const { locale } = useLanguage();
  const tDays = useTranslations("doctorDashboard.schedule.days");
  const rescheduleMutation = useRescheduleAppointment();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  const doctorId = appointment.doctor.id;
  const clinicId = appointment.clinic?.id || null;
  const isOnline = appointment.online;

  console.log("🔄 Reschedule - Appointment data:", appointment);
  console.log("🔄 Reschedule - Doctor ID:", doctorId);
  console.log("🔄 Reschedule - Clinic ID:", clinicId);

  const {
    data: daysData,
    isLoading: isLoadingDays,
    isError: isErrorDays,
  } = useAvailableDays(doctorId, clinicId);

  const {
    data: slotsData,
    isLoading: isLoadingSlots,
    isError: isErrorSlots,
  } = useAvailableSlots(doctorId, selectedDate || "", clinicId);

  const availableDays = useMemo(() => daysData?.data || [], [daysData?.data]);
  const allSlots = slotsData?.data || [];

  const availableSlots = isOnline
    ? allSlots.filter((slot) => slot.online)
    : allSlots.filter((slot) => !slot.online);

  useEffect(() => {
    if (isOpen && availableDays.length > 0) {
      if (
        !selectedDate ||
        !availableDays.find((day) => day.date === selectedDate)
      ) {
        setSelectedDate(availableDays[0].date);
        setCurrentDateIndex(0);
      }
    }
  }, [isOpen, availableDays, selectedDate]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
  };

  const handleReschedule = () => {
    if (!selectedDate || !selectedSlot) return;

    // Build ISO string with local timezone offset so the backend
    // knows this is local time, not UTC
    const newScheduledTime = buildLocalISOString(selectedDate, selectedSlot.start);

    rescheduleMutation.mutate(
      {
        appointmentId: appointment.id,
        data: { newScheduledTime },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const navigateDates = (direction: "prev" | "next") => {
    if (direction === "prev" && currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
      setSelectedDate(availableDays[currentDateIndex - 1].date);
      setSelectedSlot(null);
    } else if (
      direction === "next" &&
      currentDateIndex < availableDays.length - 1
    ) {
      setCurrentDateIndex(currentDateIndex + 1);
      setSelectedDate(availableDays[currentDateIndex + 1].date);
      setSelectedSlot(null);
    }
  };

  const formatDisplayDate = (dateString: string, locale: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return locale === "ar" ? "اليوم" : "Today";
    }
    if (isTomorrow(date)) {
      return locale === "ar" ? "الغد" : "Tomorrow";
    }
    return format(date, "EEEE, MMM d", {
      locale: locale === "ar" ? ar : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tDashboard("rescheduleAppointment")}</DialogTitle>
          <DialogDescription>{tDashboard("selectNewDate")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {tDashboard("currentAppointment")}:
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(
                      new Date(appointment.scheduledTime),
                      "EEEE, MMMM d, yyyy",
                      { locale: locale === "ar" ? ar : undefined },
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(appointment.scheduledTime), "h:mm a", {
                      locale: locale === "ar" ? ar : undefined,
                    })}{" "}
                    -{" "}
                    {format(new Date(appointment.scheduledEndTime), "h:mm a", {
                      locale: locale === "ar" ? ar : undefined,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h4 className="text-sm font-medium mb-3">
              {tDashboard("selectNewDate")}
            </h4>
            {isLoadingDays ? (
              <RescheduleDatesSkeleton />
            ) : isErrorDays ? (
              <div className="flex items-center justify-center gap-2 py-8 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{tCommon("error")}</p>
              </div>
            ) : availableDays.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">
                  {locale === "en"
                    ? "No available dates"
                    : "لا توجد تواريخ متاحة"}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDates("prev")}
                  disabled={currentDateIndex === 0}
                >
                  {locale === "ar" ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <div className="flex gap-2">
                    {availableDays
                      .slice(currentDateIndex, currentDateIndex + 3)
                      .map((day) => (
                        <Button
                          key={day.date}
                          variant={
                            selectedDate === day.date ? "default" : "outline"
                          }
                          className="flex-1 h-fit"
                          onClick={() => {
                            setSelectedDate(day.date);
                            setSelectedSlot(null);
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xs">
                              {tDays(day.dayOfWeek.toLowerCase())}
                            </span>
                            <span className="font-semibold">
                              {format(parseISO(day.date), "d", {
                                locale: locale === "ar" ? ar : undefined,
                              })}
                            </span>
                            <span className="text-xs">
                              {format(parseISO(day.date), "MMM", {
                                locale: locale === "ar" ? ar : undefined,
                              })}
                            </span>
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDates("next")}
                  disabled={currentDateIndex >= availableDays.length - 3}
                >
                  {locale === "ar" ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {selectedDate && (
            <div>
              <h4 className="text-sm font-medium mb-3">
                {locale === "en"
                  ? "Available slots for"
                  : "المواعيد المتاحة لـ"}{" "}
                {formatDisplayDate(selectedDate, locale)}
              </h4>
              {isLoadingSlots ? (
                <RescheduleSlotsSkeleton />
              ) : isErrorSlots ? (
                <div className="flex items-center justify-center gap-2 py-8 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">{tCommon("error")}</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    {locale === "en"
                      ? "No available slots for this date"
                      : "لا توجد مواعيد متاحة لهذا التاريخ"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedSlot?.start === slot.start &&
                        selectedSlot?.end === slot.end
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => handleSlotClick(slot)}
                      className={`text-xs ${slot.available ? "" : "opacity-50 line-through cursor-not-allowed"}`}
                    >
                      {getTimeIn12HourFormat(slot.start, locale)} -{" "}
                      {getTimeIn12HourFormat(slot.end, locale)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={rescheduleMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={
              !selectedDate || !selectedSlot || rescheduleMutation.isPending
            }
          >
            {rescheduleMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {tDashboard("rescheduling")}
              </>
            ) : (
              tDashboard("reschedule")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
