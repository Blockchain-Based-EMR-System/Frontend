"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  MapPin,
  Video,
  AlertCircle,
  X,
  Building2,
} from "lucide-react";
import { VacationPeriod, VacationDetail } from "../../types/schedule.types";
import { useLanguage } from "@/contexts/LanguageProvider";
import { cn } from "@/lib/utils";
import { CancelVacationDialog } from "./CancelVacationDialog";
import {
  convertDayResponseToNormalFormat,
  formatDate,
  sortDays,
} from "./helpers";

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
  const tDays = useTranslations("doctorDashboard.schedule.days");
  const { locale } = useLanguage();
  const [vacationToCancel, setVacationToCancel] =
    useState<VacationDetail | null>(null);

  const totalCancelled = vacation.vacations.reduce(
    (sum, v) => sum + v.cancelledAppointments,
    0,
  );

  const sortedVacations = [...vacation.vacations].sort((a, b) => {
    const daysInOrder = sortDays([a.dayOfWeek, b.dayOfWeek]);
    return daysInOrder.indexOf(a.dayOfWeek) - daysInOrder.indexOf(b.dayOfWeek);
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("vacationDetails")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Date Range Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold text-lg">
                  {formatDate(vacation.breakStart, locale)} -{" "}
                  {formatDate(vacation.breakEnd, locale)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {t("totalAppointmentsCancelled")}:{" "}
                  <strong className="text-orange-600">{totalCancelled}</strong>
                </span>
              </div>
            </div>

            {/* Vacation Details Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("dayOfWeek")}</TableHead>
                    <TableHead>{t("sessionType")}</TableHead>
                    <TableHead>{t("clinicDetails")}</TableHead>
                    <TableHead className="text-center">
                      {t("appointmentsCancelled")}
                    </TableHead>
                    <TableHead className="text-center">{t("action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedVacations.map((vacationDetail) => (
                    <TableRow key={vacationDetail.vacationId}>
                      <TableCell className="font-medium">
                        {tDays(
                          convertDayResponseToNormalFormat(
                            vacationDetail.dayOfWeek,
                          ),
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            vacationDetail.isOnline
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-purple-500 hover:bg-purple-600",
                          )}
                        >
                          {vacationDetail.isOnline ? (
                            <div className="flex items-center gap-2">
                              <Video className="h-3 w-3 mr-1" />
                              {t("online")}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3 w-3 mr-1" />
                              {t("offline")}
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!vacationDetail.isOnline &&
                        vacationDetail.clinicName ? (
                          <div className="text-sm">
                            <p className="font-medium">
                              {vacationDetail.clinicName}
                            </p>
                            {vacationDetail.clinicAddress && (
                              <p className="text-muted-foreground text-xs">
                                {vacationDetail.clinicAddress}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            vacationDetail.cancelledAppointments > 0
                              ? "text-orange-600"
                              : "text-muted-foreground",
                          )}
                        >
                          {vacationDetail.cancelledAppointments}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {vacationDetail.status !== "ENDED" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() => setVacationToCancel(vacationDetail)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            {t("cancel")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {vacationToCancel && (
        <CancelVacationDialog
          vacationDetail={vacationToCancel}
          open={!!vacationToCancel}
          onOpenChange={() => setVacationToCancel(null)}
        />
      )}
    </>
  );
}
