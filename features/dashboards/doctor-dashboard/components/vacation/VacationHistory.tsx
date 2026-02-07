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
import { useVacations, useClearVacation } from "../../query/useSchedule.query";
import { VacationPeriod } from "../../types/schedule.types";
import { VacationDetailDialog } from "./VacationDetailDialog";
import { ClearVacationDialog } from "./ClearVacationDialog";
import {
  format,
  parseISO,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";
import { cn } from "@/lib/utils";

const INITIAL_DISPLAY_COUNT = 5;

export function VacationHistory() {
  const t = useTranslations("doctorDashboard.vacation");
  const { locale } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [selectedVacation, setSelectedVacation] =
    useState<VacationPeriod | null>(null);
  const [vacationToClear, setVacationToClear] = useState<VacationPeriod | null>(
    null,
  );

  const { data: vacationsData, isLoading } = useVacations();
  const clearVacationMutation = useClearVacation();

  const vacations = vacationsData?.data || [];

  const { currentOrUpcoming, past } = useMemo(() => {
    const now = new Date();
    const current: VacationPeriod[] = [];
    const past: VacationPeriod[] = [];

    vacations.forEach((vacation) => {
      const endDate = parseISO(vacation.breakEnd);
      if (
        isAfter(endDate, now) ||
        format(endDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
      ) {
        current.push(vacation);
      } else {
        past.push(vacation);
      }
    });

    current.sort((a, b) => a.breakStart.localeCompare(b.breakStart));
    past.sort((a, b) => b.breakEnd.localeCompare(a.breakEnd));

    return { currentOrUpcoming: current, past };
  }, [vacations]);

  const displayedVacations = showAll
    ? [...currentOrUpcoming, ...past]
    : [...currentOrUpcoming, ...past].slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore =
    currentOrUpcoming.length + past.length > INITIAL_DISPLAY_COUNT;

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, locale === "ar" ? "d MMMM yyyy" : "MMMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const isActive = (vacation: VacationPeriod) => {
    const now = new Date();
    const start = parseISO(vacation.breakStart);
    const end = parseISO(vacation.breakEnd);
    return isWithinInterval(now, { start, end });
  };

  const handleClearVacation = () => {
    if (!vacationToClear) return;
    clearVacationMutation.mutate({ scheduleId: vacationToClear.scheduleId });
    setVacationToClear(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("settingVacation")}
          </p>
        </CardContent>
      </Card>
    );
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
              {currentOrUpcoming.map((vacation) => (
                <VacationCard
                  key={vacation.scheduleId}
                  vacation={vacation}
                  isActive={isActive(vacation)}
                  formatDate={formatDate}
                  onViewDetails={() => setSelectedVacation(vacation)}
                  onClear={() => setVacationToClear(vacation)}
                  locale={locale}
                  t={t}
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
              {past
                .slice(
                  0,
                  showAll
                    ? undefined
                    : INITIAL_DISPLAY_COUNT - currentOrUpcoming.length,
                )
                .map((vacation) => (
                  <VacationCard
                    key={vacation.scheduleId}
                    vacation={vacation}
                    isActive={false}
                    formatDate={formatDate}
                    onViewDetails={() => setSelectedVacation(vacation)}
                    onClear={null}
                    locale={locale}
                    t={t}
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

      {vacationToClear && (
        <ClearVacationDialog
          vacation={vacationToClear}
          open={!!vacationToClear}
          onOpenChange={() => setVacationToClear(null)}
          onConfirm={handleClearVacation}
          isClearing={clearVacationMutation.isPending}
        />
      )}
    </>
  );
}

interface VacationCardProps {
  vacation: VacationPeriod;
  isActive: boolean;
  formatDate: (date: string) => string;
  onViewDetails: () => void;
  onClear: (() => void) | null;
  locale: string;
  t: any;
}

function VacationCard({
  vacation,
  isActive,
  formatDate,
  onViewDetails,
  onClear,
  locale,
  t,
}: VacationCardProps) {
  return (
    <Card
      className={cn(
        "transition-all",
        isActive && "border-blue-500 bg-blue-50 dark:bg-blue-950",
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            {/* Type Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={cn(
                  "text-xs",
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
                    {vacation.dayOfWeek}
                  </>
                )}
              </Badge>
              {isActive && (
                <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                  {t("activeNow")}
                </Badge>
              )}
            </div>

            {/* Dates */}
            <p className="text-sm font-medium">
              {formatDate(vacation.breakStart)} -{" "}
              {formatDate(vacation.breakEnd)}
            </p>

            {/* Appointments Count */}
            {vacation.numOfAppointments > 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-3 w-3" />
                <span>
                  {vacation.numOfAppointments} {t("appointmentsCancelled")}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={onViewDetails}
            >
              {t("viewDetails")}
            </Button>
            {onClear && (
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={onClear}
              >
                {t("clearVacation")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
