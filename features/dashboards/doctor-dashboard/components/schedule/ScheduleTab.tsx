"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Save } from "lucide-react";
import { ClinicSelector } from "./ClinicSelector";
import { DayConfigCard } from "./DayConfigCard";
import { DeleteScheduleDialog } from "./DeleteScheduleDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useSchedule, scheduleKeys } from "../../query/useSchedule.query";
import { Clinic } from "../../types/clinic.types";
import {
  DayConfiguration,
  DayOfWeek,
  CreateScheduleRequest,
  ScheduleEntry,
} from "../../types/schedule.types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useUserStore } from "@/stores/useUserStore";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  checkScheduleAppointments,
} from "../../api/schedule.api";
import { ScheduleTabSkeleton } from "../skeletons/ScheduleTabSkeleton";

const dayOfWeekToNumber = (day: string): DayOfWeek => {
  const dayMap: Record<string, DayOfWeek> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  return dayMap[day] ?? 0;
};

interface ScheduleTabPresentationalProps {
  clinics: Clinic[];
  selectedClinicId: string | null;
  onClinicChange: (clinicId: string | null) => void;
  dayConfigs: DayConfiguration[];
  onDayConfigChange: (index: number, config: DayConfiguration) => void;
  onSave: () => void;
  isSaving: boolean;
  isLoading: boolean;
  showDeleteDialog: boolean;
  onDeleteDialogChange: (open: boolean) => void;
  pendingDeleteDayName: string;
  deleteAppointmentCount: number;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  isCheckingAppointments: boolean;
}

function ScheduleTabPresentational({
  clinics,
  selectedClinicId,
  onClinicChange,
  dayConfigs,
  onDayConfigChange,
  onSave,
  isSaving,
  isLoading,
  showDeleteDialog,
  onDeleteDialogChange,
  pendingDeleteDayName,
  deleteAppointmentCount,
  onConfirmDelete,
  onCancelDelete,
  isCheckingAppointments,
}: ScheduleTabPresentationalProps) {
  const t = useTranslations("doctorDashboard.schedule");
  const tCommon = useTranslations("common");

  const selectedClinic = clinics.find((c) => c.id === selectedClinicId);
  const hasClinic = selectedClinicId !== null;

  if (isLoading) {
    return <ScheduleTabSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
          <p className="text-muted-foreground">{t("configureFirst")}</p>
        </div>

        {/* Clinic Selector */}
        <ClinicSelector
          clinics={clinics}
          selectedClinicId={selectedClinicId}
          onClinicChange={onClinicChange}
          disabled={isSaving}
        />

        {/* Working Days Title */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-4">{t("selectWorkingDays")}</h3>
        </div>

        {/* Day Configuration Cards */}
        <div className="grid grid-cols-1 gap-4">
          {dayConfigs.map((config, index) => (
            <DayConfigCard
              key={config.day}
              config={config}
              onChange={(newConfig) => onDayConfigChange(index, newConfig)}
              hasClinic={hasClinic}
              clinicOpeningTime={selectedClinic?.opening_at}
              clinicClosingTime={selectedClinic?.closing_at}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={onSave} disabled={isSaving} size="lg">
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? tCommon("submitting") : t("saveSchedule")}
          </Button>
        </div>
      </div>

      <DeleteScheduleDialog
        open={showDeleteDialog}
        onOpenChange={onDeleteDialogChange}
        dayName={pendingDeleteDayName}
        appointmentCount={deleteAppointmentCount}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
        isDeleting={isCheckingAppointments}
      />
    </>
  );
}

interface ScheduleTabProps {
  clinics: Clinic[];
}

export function ScheduleTab({ clinics }: ScheduleTabProps) {
  const { locale } = useLanguage();
  const t = useTranslations("doctorDashboard.schedule");
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(
    clinics.length > 0 ? null : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [schedulesToDelete, setSchedulesToDelete] = useState<
    Array<{ scheduleId: string; day: DayOfWeek }>
  >([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteDay, setPendingDeleteDay] = useState<DayOfWeek | null>(
    null,
  );
  const [deleteAppointmentCount, setDeleteAppointmentCount] = useState<number>(0);
  const [isCheckingAppointments, setIsCheckingAppointments] = useState(false);

  const { data: scheduleData, isLoading: isLoadingSchedule } = useSchedule();

  const [dayConfigs, setDayConfigs] = useState<DayConfiguration[]>(
    Array.from({ length: 7 }, (_, i) => ({
      day: i as DayOfWeek,
      isActive: false,
      slotDuration: 30,
      bufferTime: 5,
      appointmentType: "online",
      offlineInterval: undefined,
      onlineInterval: undefined,
    })),
  );

  useEffect(() => {
    if (scheduleData?.data && scheduleData.data.length > 0) {
      const scheduleEntries = scheduleData.data;

      const relevantEntries = selectedClinicId
        ? scheduleEntries.filter(
            (entry: ScheduleEntry) => entry.clinicId === selectedClinicId,
          )
        : scheduleEntries.filter(
            (entry: ScheduleEntry) => entry.clinicId === null,
          );

      if (relevantEntries.length > 0) {
        const entriesByDay = relevantEntries.reduce(
          (acc: Record<number, ScheduleEntry[]>, entry: ScheduleEntry) => {
            const dayNum = dayOfWeekToNumber(entry.dayOfWeek);
            if (!acc[dayNum]) {
              acc[dayNum] = [];
            }
            acc[dayNum].push(entry);
            return acc;
          },
          {} as Record<number, ScheduleEntry[]>,
        );

        setDayConfigs((prev) =>
          prev.map((config) => {
            const dayEntries = entriesByDay[config.day];
            if (!dayEntries || dayEntries.length === 0) {
              return {
                ...config,
                isActive: false,
                appointmentType: selectedClinicId ? "offline" : "online",
                offlineInterval: undefined,
                onlineInterval: undefined,
                scheduleId: undefined,
                offlineScheduleId: undefined,
                onlineScheduleId: undefined,
              };
            }

            const onlineEntry = dayEntries.find(
              (e: ScheduleEntry) => e.isOnline,
            );
            const offlineEntry = dayEntries.find(
              (e: ScheduleEntry) => !e.isOnline,
            );

            let appointmentType: "offline" | "online" = selectedClinicId
              ? "offline"
              : "online";

            const relevantEntry = selectedClinicId ? offlineEntry : onlineEntry;
            if (!relevantEntry) {
              return {
                ...config,
                isActive: false,
                appointmentType,
                offlineInterval: undefined,
                onlineInterval: undefined,
                scheduleId: undefined,
                offlineScheduleId: undefined,
                onlineScheduleId: undefined,
              };
            }

            return {
              day: config.day,
              isActive: true,
              slotDuration: relevantEntry.slotDuration,
              bufferTime: relevantEntry.bufferTime,
              appointmentType,
              offlineInterval: offlineEntry
                ? {
                    start: offlineEntry.startTime,
                    end: offlineEntry.endTime,
                  }
                : undefined,
              onlineInterval: onlineEntry
                ? {
                    start: onlineEntry.startTime,
                    end: onlineEntry.endTime,
                  }
                : undefined,
              scheduleId: relevantEntry.id,
              offlineScheduleId: offlineEntry?.id,
              onlineScheduleId: onlineEntry?.id,
            };
          }),
        );
      } else {
        setDayConfigs((prev) =>
          prev.map((config) => ({
            ...config,
            isActive: false,
            appointmentType: selectedClinicId ? "offline" : "online",
            scheduleId: undefined,
            offlineScheduleId: undefined,
            onlineScheduleId: undefined,
          })),
        );
      }
    }
  }, [scheduleData, selectedClinicId]);

  const handleClinicChange = (clinicId: string | null) => {
    setSelectedClinicId(clinicId);

    setDayConfigs((prev) =>
      prev.map((config) => ({
        ...config,
        appointmentType: clinicId ? "offline" : "online",
        offlineInterval: clinicId ? config.offlineInterval : undefined,
        onlineInterval: !clinicId ? config.onlineInterval : undefined,
      })),
    );
  };

  const handleDayConfigChange = (index: number, config: DayConfiguration) => {
    const oldConfig = dayConfigs[index];

    if (
      oldConfig.isActive &&
      !config.isActive &&
      oldConfig.scheduleId
    ) {
      setSchedulesToDelete((prev) => {
        const exists = prev.some(item => item.scheduleId === oldConfig.scheduleId);
        if (exists) return prev;
        return [...prev, { scheduleId: oldConfig.scheduleId!, day: config.day }];
      });
    }

    if (
      !oldConfig.isActive &&
      config.isActive &&
      oldConfig.scheduleId
    ) {
      setSchedulesToDelete((prev) => 
        prev.filter(item => item.scheduleId !== oldConfig.scheduleId)
      );
    }

    setDayConfigs((prev) => {
      const newConfigs = [...prev];
      newConfigs[index] = config;
      return newConfigs;
    });
  };

  const handleConfirmDelete = async () => {
    await executeSave(true);
  };

  const handleCancelDelete = () => {
    setSchedulesToDelete([]);
    setShowDeleteDialog(false);
    executeSave(false);
  };

  const handleSave = async () => {
    const activeDays = dayConfigs.filter((config) => config.isActive);

    if (activeDays.length === 0) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? "يرجى تحديد يوم عمل واحد على الأقل"
            : "Please select at least one working day",
        variant: "destructive",
      });
      return;
    }

    if (!hasHydrated) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? "جاري تحميل بيانات المستخدم، يرجى الانتظار"
            : "Loading user data, please wait",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      console.error("User not authenticated", { user, hasHydrated });
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? "لم يتم العثور على معلومات المستخدم. يرجى تسجيل الدخول مرة أخرى"
            : "User information not found. Please login again",
        variant: "destructive",
      });
      return;
    }

    if (schedulesToDelete.length > 0) {
      try {
        setIsCheckingAppointments(true);
        const checkPromises = schedulesToDelete.map(({ scheduleId }) =>
          checkScheduleAppointments({ scheduleId })
        );
        const checkResults = await Promise.all(checkPromises);
        
        const totalAppointments = checkResults.reduce(
          (sum, result) => sum + (result.data?.numOfAppointments || 0),
          0
        );

        setIsCheckingAppointments(false);

        if (totalAppointments > 0) {
          setDeleteAppointmentCount(totalAppointments);
          setShowDeleteDialog(true);
          return; 
        }
      } catch (error) {
        console.error("Failed to check appointments:", error);
        setIsCheckingAppointments(false);
        toast({
          title: locale === "ar" ? "خطأ" : "Error",
          description:
            locale === "ar"
              ? "فشل التحقق من المواعيد"
              : "Failed to check appointments",
          variant: "destructive",
        });
        return;
      }
    }

    await executeSave(true);
  };

  const executeSave = async (includeDeletions: boolean) => {
    const activeDays = dayConfigs.filter((config) => config.isActive);

    try {
      setIsSaving(true);
      const promises: Promise<any>[] = [];

      if (includeDeletions && schedulesToDelete.length > 0) {
        schedulesToDelete.forEach(({ scheduleId }) => {
          promises.push(deleteSchedule(scheduleId));
        });
      }

      activeDays.forEach((config) => {
        const interval =
          config.appointmentType === "offline"
            ? config.offlineInterval
            : config.onlineInterval;

        if (!interval) {
          return;
        }

        const isOnline = config.appointmentType === "online";

        if (config.scheduleId) {
          promises.push(
            updateSchedule({
              scheduleId: config.scheduleId,
              clinicId: isOnline ? null : (selectedClinicId || null),
              workingDay: config.day,
              startTime: interval.start,
              endTime: interval.end,
              slotDuration: config.slotDuration,
              bufferTime: config.bufferTime,
              isOnline: isOnline,
            }),
          );
        } else {
          promises.push(
            createSchedule({
              clinicId: isOnline ? null : (selectedClinicId || null),
              workingDay: config.day,
              startTime: interval.start,
              endTime: interval.end,
              slotDuration: config.slotDuration,
              bufferTime: config.bufferTime,
              isOnline: isOnline,
            }),
          );
        }
      });

      if (promises.length === 0) {
        setIsSaving(false);
        toast({
          title: locale === "ar" ? "خطأ" : "Error",
          description:
            locale === "ar" ? "لا توجد تغييرات لحفظها" : "No changes to save",
          variant: "destructive",
        });
        return;
      }

      await Promise.all(promises);

      setSchedulesToDelete([]);

      await queryClient.invalidateQueries({ queryKey: scheduleKeys.all });

      setIsSaving(false);

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description:
          locale === "ar"
            ? "تم تحديث الجدول بنجاح"
            : "Schedule updated successfully",
      });
    } catch (error: any) {
      setIsSaving(false);
      console.error("Failed to update schedule:", error);
      
      const isDuplicateError = error?.response?.status === 500 && 
        (error?.message?.includes("Unique constraint") || 
         error?.response?.data?.message?.includes("already exists") ||
         error?.response?.data?.messageEn?.includes("already exists"));
      
      if (isDuplicateError) {
        toast({
          title: locale === "ar" ? "خطأ - جدول موجود بالفعل" : "Error - Schedule Already Exists",
          description:
            locale === "ar" 
              ? "يوجد جدول لهذا اليوم في هذه العيادة. يرجى تحديث الصفحة لرؤية جميع الجداول."
              : "A schedule for this day at this clinic already exists. Please refresh the page to see all schedules.",
          variant: "destructive",
          duration: 7000,
        });
      } else {
        toast({
          title: locale === "ar" ? "خطأ" : "Error",
          description:
            locale === "ar" ? "فشل في تحديث الجدول" : "Failed to update schedule",
          variant: "destructive",
        });
      }
    }
  };

  const getPendingDeleteDayName = () => {
    if (pendingDeleteDay === null) return "";
    return t(`days.${pendingDeleteDay}`);
  };

  return (
    <ScheduleTabPresentational
      clinics={clinics}
      selectedClinicId={selectedClinicId}
      onClinicChange={handleClinicChange}
      dayConfigs={dayConfigs}
      onDayConfigChange={handleDayConfigChange}
      onSave={handleSave}
      isSaving={isSaving}
      isLoading={isLoadingSchedule}
      showDeleteDialog={showDeleteDialog}
      onDeleteDialogChange={setShowDeleteDialog}
      pendingDeleteDayName={getPendingDeleteDayName()}
      deleteAppointmentCount={deleteAppointmentCount}
      onCancelDelete={handleCancelDelete}
      onConfirmDelete={handleConfirmDelete}
      isCheckingAppointments={isCheckingAppointments}
    />
  );
}
