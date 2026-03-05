"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, CalendarDays, Building2 } from "lucide-react";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { NurseScheduleEntry } from "../../types/nurseDashboardTypes";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getTimeIn12HourFormat } from "@/lib/helpers";

interface AppointmentSelectionDialogProps {
  open: boolean;
  scheduleEntries: NurseScheduleEntry[];
  onConfirm: (entry: NurseScheduleEntry, date: Date) => void;
}

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export function AppointmentSelectionDialog({
  open,
  scheduleEntries,
  onConfirm,
}: AppointmentSelectionDialogProps) {
  const t = useTranslations("nurseDashboard");
  const tDoctorDashboard = useTranslations("doctorDashboard");
  const { locale } = useLanguage();

  const [selectedId, setSelectedId] = useState<string>(
    scheduleEntries.length === 1 ? scheduleEntries[0].id : "",
  );
  const [date, setDate] = useState<Date>(new Date());

  const handleConfirm = () => {
    const entry = scheduleEntries.find((e) => e.id === selectedId);
    if (!entry) return;
    onConfirm(entry, date);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        /* non-dismissible */
      }}
    >
      <DialogContent
        className="max-w-lg max-h-[85vh] overflow-y-auto [&>button:last-of-type]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("appointments.selectPair")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Doctor + Clinic selection */}
          <RadioGroup
            dir={locale === "ar" ? "rtl" : "ltr"}
            value={selectedId}
            onValueChange={setSelectedId}
            className="space-y-3"
          >
            {scheduleEntries.map((entry) => {
              const initials = entry.doctor.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <Label
                  key={entry.id}
                  htmlFor={entry.id}
                  className="cursor-pointer"
                >
                  <div
                    className={`border rounded-lg p-4 transition-colors ${
                      selectedId === entry.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value={entry.id}
                        id={entry.id}
                        className="mt-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        {/* Doctor header */}
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={entry.doctor.profilePic ?? undefined}
                              alt={entry.doctor.name}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {entry.doctor.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {entry.clinic.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Working days */}
                        <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {t("schedule.workingDays")}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.working_days.map((wd) => (
                            <Badge
                              key={wd.day_of_week}
                              variant="outline"
                              className="text-xs"
                            >
                              {tDoctorDashboard(`schedule.days.${wd.day_of_week.toLowerCase()}`)}{" "}
                              {getTimeIn12HourFormat(wd.start_time, locale)}–{getTimeIn12HourFormat(wd.end_time, locale)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>

          {/* Date picker */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium">
              {t("appointments.selectDate")}
            </p>
            <DatePickerPopover
              date={date}
              onDateChange={(d) => d && setDate(d)}
              toYear={new Date().getFullYear() + 1}
            />
          </div>

          {/* Confirm */}
          <Button
            className="w-full"
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            {t("appointments.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
