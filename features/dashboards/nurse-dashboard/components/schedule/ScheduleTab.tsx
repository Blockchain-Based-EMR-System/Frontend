"use client";

import { useNurseSchedule } from "../../query/useNurseDashboard.query";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  MapPin,
  CalendarOff,
  ExternalLink,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getTimeIn12HourFormat } from "@/lib/helpers";
import { Separator } from "@/components/ui/separator";

export function ScheduleTab() {
  const t = useTranslations("nurseDashboard");
  const tDoctorDashboard = useTranslations("doctorDashboard");
  const { locale } = useLanguage();
  const { data, isLoading } = useNurseSchedule();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, d) => (
                  <div key={d} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const schedule = data?.data ?? [];

  if (schedule.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <CalendarOff className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">{t("schedule.noSchedule")}</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("schedule.noScheduleDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("schedule.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("schedule.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {schedule.map((entry) => {
          const initials = entry.doctor.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          return (
            <Card key={entry.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={entry.doctor.profilePic ?? undefined}
                      alt={entry.doctor.name}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {entry.doctor.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{entry.clinic.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{entry.clinic.address}</span>
                </div>
                {entry.clinic.address_maps_link && (
                    <a
                      href={entry.clinic.address_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-primary text-sm hover:underline underline-offset-8 w-fit flex items-center gap-1.5"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {locale === "ar" ? "الاتجاهات" : "Directions"}
                    </a>
                  )}

                  <Separator className="my-2" />
              </CardHeader>

              <CardContent>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {t("schedule.workingDays")}
                </p>
                <div className="space-y-1.5">
                  {entry.working_days.map((wd) => (
                    <div
                      key={wd.day_of_week}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium">
                        {tDoctorDashboard(`schedule.days.${wd.day_of_week.toLowerCase()}`)}  
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeIn12HourFormat(wd.start_time, locale)} – {getTimeIn12HourFormat(wd.end_time, locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
