"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardUser } from "../types/dashboardTypes";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CalendarCheck,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useTodayAppointment } from "../query/useDashboard.query";
import { format } from "date-fns";
import Link from "next/link";
import { getInitials } from "@/lib/helpers";
import { DashboardSkeleton } from "./skeletons";
import { QueueStatusCard } from "./QueueStatusCard";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getTimeIn12HourFormat } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export interface DashboardPresentationalProps {
  user: DashboardUser | null;
  isLoading: boolean;
  isError: boolean;
  onLogout: () => void;
  tDashboard: (key: string) => string;
  tFields: (key: string) => string;
  tCommon: (key: string) => string;
}

export function DashboardPresentational({
  user,
  isLoading,
  isError,
  tDashboard,
  tCommon,
}: DashboardPresentationalProps) {
  const { data: todayAppointment, isLoading: isLoadingAppointment } =
    useTodayAppointment();
  const { locale } = useLanguage();

  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">
              {tCommon("error")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isCompleted = todayAppointment?.status === "COMPLETED";
  const isCancelled = todayAppointment?.status === "CANCELLED";
  const hasAppointment =
    todayAppointment?.status === "CONFIRMED" ||
    todayAppointment?.status === "RESCHEDULED" ||
    isCompleted ||
    isCancelled;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {tDashboard("welcomeBack")}, {user.name}!
          </CardTitle>
        </CardHeader>
      </Card>

      <Card
        className={cn(
          "transition-all relative",
          isCompleted && "border-green-800 bg-green-800/30",
          isCancelled && "border-red-800 bg-red-800/30",
        )}
      >
        {/* Watermark icon overlay for COMPLETED / CANCELLED */}
        {(isCompleted || isCancelled) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {isCompleted ? (
              <CheckCircle2 className="h-24 w-24 text-green-600 drop-shadow-lg opacity-30" />
            ) : (
              <XCircle className="h-24 w-24 text-red-600 drop-shadow-lg opacity-30" />
            )}
          </div>
        )}

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            {tDashboard("todaysAppointment")}
          </CardTitle>
        </CardHeader>

        <CardContent
          className={cn(isCompleted || isCancelled ? "opacity-60" : "")}
        >
          {isLoadingAppointment ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 mt-0.5 bg-muted animate-pulse rounded" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-9 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ) : hasAppointment ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={todayAppointment.doctor?.profilePic || undefined}
                    alt={todayAppointment.doctor?.name || "Doctor"}
                  />
                  <AvatarFallback>
                    <p className="text-2xl text-primary">
                      {getInitials(todayAppointment.doctor?.name)}
                    </p>
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold">
                    {tCommon("doctor")}
                    {todayAppointment.doctor?.name || "Unknown"}
                  </h3>
                  <div className="mt-1 text-muted-foreground">
                    {todayAppointment.online ? (
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        {tDashboard("onlineConsultation")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {tDashboard("inClinic")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {getTimeIn12HourFormat(
                    todayAppointment.scheduledTime,
                    locale,
                  
                  )}{" "}
                  -{" "}
                  {getTimeIn12HourFormat(
                    todayAppointment.scheduledEndTime,
                    locale,
            
                  )}
                </span>
              </div>

              {todayAppointment.online ? (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Video className="h-4 w-4" />
                  <span className="font-medium">
                    {tDashboard("onlineConsultation")}
                  </span>
                </div>
              ) : (
                todayAppointment.clinic && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">
                          {todayAppointment.clinic.name}
                        </p>
                        <p className="text-muted-foreground">
                          {todayAppointment.clinic.address}
                        </p>
                      </div>
                    </div>
                    {todayAppointment.clinic.mapsLink && (
                      <Link
                        href={todayAppointment.clinic.mapsLink}
                        className="w-full sm:w-auto flex items-center gap-2 text-sm text-primary"
                      >
                        <MapPin className="h-4 w-4" />
                        {locale === "en" ? "Directions" : "الاتجاهات"}
                      </Link>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-lg font-medium">
                {tDashboard("noAppointmentsToday")}
              </p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {tDashboard("noAppointmentsTodayDesc")}
              </p>
              <Button asChild>
                <Link href="/clinics">{tDashboard("bookAppointment")}</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {todayAppointment?.status === "CONFIRMED" && (
        <QueueStatusCard
          appointmentId={todayAppointment.id}
          tDashboard={tDashboard}
        />
      )}
    </div>
  );
}
