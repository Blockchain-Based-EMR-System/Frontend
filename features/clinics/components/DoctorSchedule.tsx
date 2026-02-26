"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useAvailableDays,
  useAvailableSlots,
} from "../query/appointments.query";
import { useAppointmentNavigationStore } from "@/stores/useAppointmentNavigationStore";
import { TimeSlot } from "../types/appointments.types";
import { BookAppointmentModal } from "./BookAppointmentModal";
import { AvailableDaysSkeleton, AvailableSlotsSkeleton } from "../skeletons";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Video,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getTimeIn12HourFormat, getInitials } from "@/lib/helpers";

export function DoctorSchedule() {
  const t = useTranslations("clinics.schedule");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("fields");
  const tDays = useTranslations("doctorDashboard.schedule.days");
  const { locale } = useLanguage();
  const router = useRouter();
  const { selectedDoctor, selectedClinic } = useAppointmentNavigationStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  useEffect(() => {
    document.cookie = "ScheduleNavigation=; path=/; max-age=0";

    if (!selectedDoctor) {
      router.push("/clinics");
    }
  }, [selectedDoctor, router]);

  const isOnline = !selectedClinic;

  console.log("📅 DoctorSchedule - Selected Doctor:", selectedDoctor);
  console.log("📅 Doctor ID:", selectedDoctor?.id);
  console.log("📅 Selected Clinic:", selectedClinic);
  console.log("📅 Clinic ID:", selectedClinic?.id);
  console.log("📅 Is Online:", isOnline);

  const {
    data: daysData,
    isLoading: isLoadingDays,
    isError: isErrorDays,
  } = useAvailableDays(selectedDoctor?.id || "", selectedClinic?.id || null);

  const {
    data: slotsData,
    isLoading: isLoadingSlots,
    isError: isErrorSlots,
  } = useAvailableSlots(
    selectedDoctor?.id || "",
    selectedDate || "",
    selectedClinic?.id || null,
  );

  const availableDays = daysData?.data || [];
  const allSlots = slotsData?.data || [];

  const availableSlots = selectedClinic
    ? allSlots.filter((slot) => !slot.online)
    : allSlots;

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  const navigateDates = (direction: "prev" | "next") => {
    if (direction === "prev" && currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
      setSelectedDate(availableDays[currentDateIndex - 1].date);
    } else if (
      direction === "next" &&
      currentDateIndex < availableDays.length - 1
    ) {
      setCurrentDateIndex(currentDateIndex + 1);
      setSelectedDate(availableDays[currentDateIndex + 1].date);
    }
  };

  useEffect(() => {
    if (availableDays.length > 0 && !selectedDate) {
      setSelectedDate(availableDays[0].date);
      setCurrentDateIndex(0);
    }
  }, [availableDays, selectedDate]);

  if (!selectedDoctor) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("doctorInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={selectedDoctor.profilePic || undefined}
                  alt={selectedDoctor.name}
                />
                <AvatarFallback>
                  {getInitials(selectedDoctor.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold">
                  {tCommon("doctor")} {selectedDoctor.name}
                </h2>
                {selectedDoctor.specialization && (
                  <p className="text-muted-foreground">
                    {tFields("specialization")}: {selectedDoctor.specialization}
                  </p>
                )}
                <p className="text-muted-foreground">
                  {tFields("fees")}: {selectedDoctor.fees} {tCommon("egp")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedClinic && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t("clinicInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="text-lg font-semibold">{selectedClinic.name}</h3>
              <div className="flex items-start gap-2 text-sm">
                <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <span>{selectedClinic.address}</span>
              </div>
              {selectedClinic.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span dir="ltr">{selectedClinic.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="flex gap-1">
                  <span>
                    {getTimeIn12HourFormat(selectedClinic.opening_at, locale)}
                  </span>{" "}
                  -
                  <span>
                    {getTimeIn12HourFormat(selectedClinic.closing_at, locale)}
                  </span>
                </span>
              </div>
              <Link
                href={selectedClinic.address_maps_link}
                target="_blank"
                className="flex items-start gap-2 text-sm text-primary font-bold"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4 mt-0.5  shrink-0" />
                <span>{locale === "en" ? "Directions" : "الاتجاهات"}</span>
              </Link>
            </CardContent>
          </Card>
        )}

        {isOnline && (
          <div className="flex items-center justify-center gap-2 bg-primary/10 text-primary rounded-lg p-3 text-xl font-bold">
            <Video className="h-6 w-6" />
            <p>{t("onlineConsultation")}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t("availableDates")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDays ? (
              <AvailableDaysSkeleton />
            ) : isErrorDays ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t("errors.loadingSchedule")}
                </AlertDescription>
              </Alert>
            ) : availableDays.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t("noAvailableDates")}</AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDates("prev")}
                  disabled={currentDateIndex === 0}
                >
                  {locale === "en" ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex-1 overflow-x-auto">
                  <div className="flex gap-2">
                    {availableDays
                      .slice(currentDateIndex, currentDateIndex + 5)
                      .map((day) => (
                        <Button
                          key={day.date}
                          variant={
                            selectedDate === day.date ? "default" : "outline"
                          }
                          className="flex-col h-auto py-3 px-4 min-w-[100px]"
                          onClick={() => {
                            setSelectedDate(day.date);
                            setCurrentDateIndex(
                              availableDays.findIndex(
                                (d) => d.date === day.date,
                              ),
                            );
                          }}
                        >
                          <div className="text-xs">
                            {tDays(day.dayOfWeek.toLowerCase())}
                          </div>
                          <div className="text-lg font-bold">
                            {format(new Date(day.date), "dd", {
                              locale: locale === "ar" ? ar : undefined,
                            })}
                          </div>
                          <div className="text-xs">
                            {format(new Date(day.date), "MMM", {
                              locale: locale === "ar" ? ar : undefined,
                            })}
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDates("next")}
                  disabled={currentDateIndex >= availableDays.length - 5}
                >
                  {locale === "en" ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("availableSlots")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t("selectDateFirst")}</AlertDescription>
              </Alert>
            ) : isLoadingSlots ? (
              <AvailableSlotsSkeleton />
            ) : isErrorSlots ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t("errors.loadingSchedule")}
                </AlertDescription>
              </Alert>
            ) : availableSlots.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t("noAvailableSlots")}</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={slot.available ? "outline" : "ghost"}
                    disabled={!slot.available}
                    className={cn(
                      "flex-col h-auto py-3 relative cursor-pointer",
                      !slot.available &&
                        "opacity-50 cursor-not-allowed border border-muted-foreground/30",
                    )}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div
                      className={`text-sm font-semibold ${!slot.available ? "line-through text-muted-foreground" : ""}`}
                    >
                      {getTimeIn12HourFormat(slot.start, locale)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getTimeIn12HourFormat(slot.end, locale)}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedSlot && selectedDate && (
        <BookAppointmentModal
          isOpen={showBookingModal}
          onClose={handleCloseModal}
          doctor={selectedDoctor}
          clinic={selectedClinic}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />
      )}
    </div>
  );
}
