"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScheduleEntry } from "../../types/schedule.types";
import {
  checkMultipleVacations,
  setMultipleVacations,
  getSchedule,
} from "../../api/schedule.api";
import { scheduleKeys } from "../../query/useSchedule.query";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { format, addDays, differenceInDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VacationTabSkeleton } from "../skeletons/VacationTabSkeleton";
import { VacationHistory } from "./VacationHistory";
import { sortDays } from "./helpers";
import { getTimeIn12HourFormat } from "@/lib/helpers";

interface GroupedSchedule {
  label: string;
  schedules: ScheduleEntry[];
  clinicId: string | null;
}

interface VacationTabProps {
  clinics: Array<{ id: string; name: string }>;
}

export function VacationTab({ clinics }: VacationTabProps) {
  const { locale } = useLanguage();
  const t = useTranslations("doctorDashboard.vacation");
  const tSchedule = useTranslations("doctorDashboard.schedule");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();

  const [activeView, setActiveView] = useState<"schedule" | "history">(
    "schedule",
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSchedules, setSelectedSchedules] = useState<Set<string>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(0);

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: scheduleKeys.all,
    queryFn: getSchedule,
  });

  const groupedSchedules: GroupedSchedule[] = useMemo(() => {
    if (!scheduleData?.data) return [];

    const groups: Record<string, GroupedSchedule> = {};

    scheduleData.data.forEach((schedule: ScheduleEntry) => {
      const key = schedule.clinicId || "online";

      if (!groups[key]) {
        const label =
          schedule.clinicId === null
            ? t("onlineOnly")
            : clinics.find((c) => c.id === schedule.clinicId)?.name || "Clinic";

        groups[key] = {
          label,
          schedules: [],
          clinicId: schedule.clinicId,
        };
      }

      groups[key].schedules.push(schedule);
    });

    return Object.values(groups);
  }, [scheduleData, clinics, t]);

  const handleScheduleToggle = (scheduleId: string) => {
    setSelectedSchedules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scheduleId)) {
        newSet.delete(scheduleId);
      } else {
        newSet.add(scheduleId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: t("selectDateRange"),
        variant: "destructive",
      });
      return;
    }

    if (selectedSchedules.size === 0) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: t("selectAtLeastOneSchedule"),
        variant: "destructive",
      });
      return;
    }

    const daysDiff = differenceInDays(dateRange.to, dateRange.from);
    if (daysDiff > 90) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: t("maxDurationExceeded"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const checkRequests = Array.from(selectedSchedules).map((scheduleId) => ({
        scheduleId,
        startDate: format(dateRange.from!, "yyyy-MM-dd"),
        endDate: format(dateRange.to!, "yyyy-MM-dd"),
      }));

      const checkResults = await checkMultipleVacations(checkRequests);

      const totalAppointments = checkResults.reduce((sum, result) => {
        if (!result.data) return sum;
        return sum + (result.data.numOfAppointments || 0);
      }, 0);

      if (totalAppointments > 0) {
        setAppointmentCount(totalAppointments);
        setShowConfirmDialog(true);
        setIsSubmitting(false);
      } else {
        await setVacations();
      }
    } catch (error) {
      console.error("Vacation check failed:", error);
      setIsSubmitting(false);
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: t("checkFailed"),
        variant: "destructive",
      });
    }
  };

  const setVacations = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    try {
      setIsSubmitting(true);

      const requests = Array.from(selectedSchedules).map((scheduleId) => ({
        scheduleId,
        startDate: format(dateRange.from!, "yyyy-MM-dd"),
        endDate: format(dateRange.to!, "yyyy-MM-dd"),
      }));

      await setMultipleVacations(requests);

      await queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      await queryClient.invalidateQueries({ queryKey: scheduleKeys.vacations });

      setDateRange(undefined);
      setSelectedSchedules(new Set());
      setShowConfirmDialog(false);
      setIsSubmitting(false);

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: t("vacationSetSuccess"),
      });
    } catch (error) {
      console.error("Set vacation failed:", error);
      setIsSubmitting(false);
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: t("vacationSetFailed"),
        variant: "destructive",
      });
    }
  };

  const sortedGroupedSchedules = useMemo(() => {
    return groupedSchedules.map((group) => ({
      ...group,
      schedules: group.schedules.sort((a, b) => {
        const daysInOrder = sortDays([a.dayOfWeek, b.dayOfWeek]);
        return daysInOrder.indexOf(a.dayOfWeek) - daysInOrder.indexOf(b.dayOfWeek);
      }),
    }));
  }, [groupedSchedules]);

  if (isLoading) {
    return <VacationTabSkeleton />;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addDays(today, 90);

  return (
    <>
      <div className="space-y-6">
        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-lg border bg-muted p-1">
            <Button
              variant={activeView === "schedule" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("schedule")}
              className="rounded-md"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t("scheduleVacation")}
            </Button>
            <Button
              variant={activeView === "history" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("history")}
              className="rounded-md"
            >
              {t("vacationManagement")}
            </Button>
          </div>
        </div>

        {/* Schedule Vacation View */}
        {activeView === "schedule" && (
          <>
            {sortedGroupedSchedules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t("noSchedules")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t("noSchedulesDescription")}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Date Range Picker */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t("selectVacationPeriod")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DateRangePicker
                      date={dateRange}
                      onDateChange={setDateRange}
                      placeholder={t("selectDateRangePlaceholder")}
                      minDate={today}
                      maxDate={maxDate}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("maxDuration", { days: 90 })}
                    </p>
                  </CardContent>
                </Card>

                {/* Schedule Selection Grid */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {t("selectSchedulesTitle")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedGroupedSchedules.map((group) => (
                      <Card
                        key={group.clinicId || "online"}
                        className="overflow-hidden"
                      >
                        <CardHeader className="bg-muted/50 pb-3">
                          <CardTitle className="text-base">
                            {group.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            {group.schedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                              >
                                <Checkbox
                                  id={schedule.id}
                                  checked={selectedSchedules.has(schedule.id)}
                                  onCheckedChange={() =>
                                    handleScheduleToggle(schedule.id)
                                  }
                                  disabled={isSubmitting}
                                />
                                <div
                                  className="flex-1 space-y-1"
                                  onClick={() =>
                                    handleScheduleToggle(schedule.id)
                                  }
                                >
                                  <p className="text-sm font-medium cursor-pointer">
                                    {tSchedule(
                                      `days.${schedule.dayOfWeek.toLowerCase()}`,
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    <span dir="ltr">
                                      {getTimeIn12HourFormat(schedule.startTime)}
                                    </span>
                                    {" - "}
                                    <span dir="ltr">
                                      {getTimeIn12HourFormat(schedule.endTime)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting || selectedSchedules.size === 0 || !dateRange
                    }
                    size="lg"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    {t("setVacation")}
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {/* Vacation History View */}
        {activeView === "history" && <VacationHistory />}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/10 rounded-full">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <DialogTitle>{t("confirmVacationTitle")}</DialogTitle>
                <DialogDescription className="mt-1">
                  {t("confirmVacationDescription", { count: appointmentCount })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              {t("appointmentsWillBeCancelled", { count: appointmentCount })}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setIsSubmitting(false);
              }}
              disabled={isSubmitting}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="default"
              onClick={setVacations}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("confirmAndSetVacation")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
