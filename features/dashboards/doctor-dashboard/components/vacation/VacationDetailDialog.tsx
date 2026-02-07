"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Video, Clock, AlertCircle } from "lucide-react";
import { VacationPeriod } from "../../types/schedule.types";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageProvider";
import { cn } from "@/lib/utils";

interface VacationDetailDialogProps {
  vacation: VacationPeriod;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VacationDetailDialog({
  vacation,
  open,
  onOpenChange,
}: VacationDetailDialogProps) {
  const t = useTranslations("doctorDashboard.vacation");
  const { locale } = useLanguage();

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, locale === "ar" ? "d MMMM yyyy" : "MMMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      return format(new Date(`2000-01-01T${timeStr}`), "h:mm a");
    } catch {
      return timeStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("vacationDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-sm",
                vacation.isOnline
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-purple-500 hover:bg-purple-600",
              )}
            >
              {vacation.isOnline ? (
                <>
                  <Video className="h-3 w-3 mr-1" />
                  {t("onlineOnly")}
                </>
              ) : (
                <>
                  <MapPin className="h-3 w-3 mr-1" />
                  {t("offlineOnly")}
                </>
              )}
            </Badge>
          </div>

          {/* Date Range */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t("fromDate")}:</p>
                  <p>{formatDate(vacation.breakStart)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t("toDate")}:</p>
                  <p>{formatDate(vacation.breakEnd)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affected Schedules */}
          <div>
            <h3 className="text-sm font-semibold mb-2">
              {t("affectedSchedules")}
            </h3>
            <Card>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("dayOfWeek")}:
                  </span>
                  <span className="font-medium">{vacation.dayOfWeek}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("sessionType")}:
                  </span>
                  <Badge
                    variant={vacation.isOnline ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {vacation.isOnline ? t("onlineOnly") : t("offline")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("timeSlot")}:
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">
                      {formatTime(vacation.breakStart.split("T")[1])} -{" "}
                      {formatTime(vacation.breakEnd.split("T")[1])}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Cancelled */}
          <Card
            className={
              vacation.numOfAppointments > 0
                ? "border-orange-300 bg-orange-50 dark:bg-orange-950"
                : ""
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle
                  className={cn(
                    "h-4 w-4",
                    vacation.numOfAppointments > 0
                      ? "text-orange-600"
                      : "text-muted-foreground",
                  )}
                />
                <div>
                  <p className="text-sm font-medium">
                    {t("appointmentsCancelled")}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold",
                      vacation.numOfAppointments > 0
                        ? "text-orange-600"
                        : "text-muted-foreground",
                    )}
                  >
                    {vacation.numOfAppointments}
                  </p>
                  {vacation.numOfAppointments === 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("noAppointments")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
