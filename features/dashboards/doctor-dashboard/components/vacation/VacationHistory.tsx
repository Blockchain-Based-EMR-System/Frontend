"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Video,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useVacations } from "../../query/useSchedule.query";
import { VacationPeriod } from "../../types/schedule.types";
import { VacationDetailDialog } from "./VacationDetailDialog";
import { cn } from "@/lib/utils";
import {
  formatDate,
  convertDayResponseToNormalFormat,
  sortDays,
} from "./helpers";
import { VacationHistorySkeleton } from "../skeletons/VacationHistorySkeleton";

const INITIAL_DISPLAY_COUNT = 5;

export function VacationHistory() {
  const t = useTranslations("doctorDashboard.vacation");
  const tDays = useTranslations("doctorDashboard.schedule.days");
  const { locale } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [selectedVacation, setSelectedVacation] =
    useState<VacationPeriod | null>(null);

  const { data: vacationsData, isLoading } = useVacations();

  const vacations = vacationsData?.data || [];

  const { currentOrUpcoming, past } = useMemo(() => {
    const current: VacationPeriod[] = [];
    const past: VacationPeriod[] = [];

    vacations.forEach((vacation) => {
      const hasActiveVacation = vacation.vacations.some(
        (v) => v.status === "UPCOMING" || v.status === "CURRENT",
      );

      if (hasActiveVacation) {
        current.push(vacation);
      } else {
        past.push(vacation);
      }
    });

    current.sort((a, b) => a.breakStart.localeCompare(b.breakStart));
    past.sort((a, b) => b.breakEnd.localeCompare(a.breakEnd));

    return { currentOrUpcoming: current, past };
  }, [vacations]);

  const hasMore =
    currentOrUpcoming.length + past.length > INITIAL_DISPLAY_COUNT;

  const isActive = (vacation: VacationPeriod) => {
    return vacation.vacations.some((v) => v.status === "CURRENT");
  };

  const getTotalCancelledAppointments = (vacation: VacationPeriod) => {
    return vacation.vacations.reduce(
      (total, v) => total + v.cancelledAppointments,
      0,
    );
  };

  const getUniqueDays = (vacation: VacationPeriod) => {
    const uniqueDays = new Set(vacation.vacations.map((v) => v.dayOfWeek));
    return sortDays(Array.from(uniqueDays));
  };

  if (isLoading) {
    return <VacationHistorySkeleton />;
  }

  if (vacations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("history")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold text-lg mb-1">{t("noVacations")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("noVacationsDescription")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("history")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Current/Upcoming Section */}
          {currentOrUpcoming.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {t("currentVacation")}
              </h3>
              {currentOrUpcoming.map((vacation, index) => (
                <VacationCard
                  key={`${vacation.breakStart}-${vacation.breakEnd}-${index}`}
                  vacation={vacation}
                  isActive={isActive(vacation)}
                  formatDate={(date) => formatDate(date, locale)}
                  getTotalCancelledAppointments={getTotalCancelledAppointments}
                  getUniqueDays={getUniqueDays}
                  onViewDetails={() => setSelectedVacation(vacation)}
                  locale={locale}
                  t={t}
                  tDays={tDays}
                />
              ))}
            </div>
          )}

          {/* Past Vacations Section */}
          {past.length > 0 && showAll && (
            <div className="space-y-2 pt-3 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {t("pastVacations")}
              </h3>
              {past.map((vacation, index) => (
                <VacationCard
                  key={`${vacation.breakStart}-${vacation.breakEnd}-${index}`}
                  vacation={vacation}
                  isActive={false}
                  formatDate={(date) => formatDate(date, locale)}
                  getTotalCancelledAppointments={getTotalCancelledAppointments}
                  getUniqueDays={getUniqueDays}
                  onViewDetails={() => setSelectedVacation(vacation)}
                  locale={locale}
                  t={t}
                  tDays={tDays}
                />
              ))}
            </div>
          )}

          {/* See More/Less Button */}
          {hasMore && (
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  {t("seeLess")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  {t("seeMore")} (
                  {currentOrUpcoming.length +
                    past.length -
                    INITIAL_DISPLAY_COUNT}
                  )
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {selectedVacation && (
        <VacationDetailDialog
          vacation={selectedVacation}
          open={!!selectedVacation}
          onOpenChange={() => setSelectedVacation(null)}
        />
      )}
    </>
  );
}

interface VacationCardProps {
  vacation: VacationPeriod;
  isActive: boolean;
  formatDate: (date: string) => string;
  getTotalCancelledAppointments: (vacation: VacationPeriod) => number;
  getUniqueDays: (vacation: VacationPeriod) => string[];
  onViewDetails: () => void;
  locale: string;
  t: any;
  tDays: any;
}

function VacationCard({
  vacation,
  isActive,
  formatDate,
  getTotalCancelledAppointments,
  getUniqueDays,
  onViewDetails,
  locale,
  t,
  tDays,
}: VacationCardProps) {
  const totalCancelled = getTotalCancelledAppointments(vacation);
  const uniqueDays = getUniqueDays(vacation);

  return (
    <Card
      className={cn(
        "transition-all",
        isActive && "border-blue-500 bg-blue-50 dark:bg-blue-950",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Active Badge */}
            {isActive && (
              <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                {t("activeNow")}
              </Badge>
            )}

            {/* Date Range */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                {formatDate(vacation.breakStart)} -{" "}
                {formatDate(vacation.breakEnd)}
              </span>
            </div>

            {/* Days Off */}
            <div className="flex items-start gap-2 text-sm">
              <span className="text-muted-foreground font-medium">
                {t("daysOff")}:
              </span>
              <div className="flex flex-wrap gap-1">
                {uniqueDays.map((day) => (
                  <Badge key={day} variant="outline" className="text-xs">
                    {tDays(convertDayResponseToNormalFormat(day))}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Total Appointments Cancelled */}
            {totalCancelled > 0 && (
              <div className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">
                  {totalCancelled} {t("appointmentsCancelled")}
                </span>
              </div>
            )}
          </div>

          {/* View Details Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-3"
            onClick={onViewDetails}
          >
            {t("viewDetails")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
