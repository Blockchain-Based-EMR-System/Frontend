"use client";

import { useNurseApplications } from "@/features/join/nurse";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, ClipboardX, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Separator } from "@/components/ui/separator";
import { getTimeIn12HourFormat } from "@/lib/helpers";

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "outline" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export function ApplicationsTab() {
  const t = useTranslations("nurseDashboard");
  const tDoctorDashboard = useTranslations("doctorDashboard");
  const { data, isLoading } = useNurseApplications();
  const { locale } = useLanguage();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full shrink-0" />
              </div>
              <Skeleton className="h-3 w-24" />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 3 }).map((_, b) => (
                  <Skeleton key={b} className="h-6 w-28 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const applications = data?.data ?? [];

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <ClipboardX className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">
          {t("applications.noApplications")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("applications.noApplicationsDesc")}
        </p>
        <Button onClick={() => router.push("/announcements")}>
          {t("applications.browseAnnouncements")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("applications.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("applications.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {applications.map((app) => {
          const initials = app.doctor.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          const statusKey = app.application_status as ApplicationStatus;

          return (
            <Card key={app.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarImage
                        src={app.doctor.profilePic ?? undefined}
                        alt={app.doctor.name}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{app.doctor.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {app.clinic.name}
                      </div>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANT[statusKey]}>
                    {t(`applications.status.${app.application_status}`)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div>
                  <p className="text-sm flex items-center gap-1.5 text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {app.clinic.address}
                  </p>
                  <a href={app?.clinic?.address_maps_link || undefined} target="_blank" className="text-xs font-semibold tracking-wide text-primary mb-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {locale === "ar"
                      ? `الاتجاهات`
                      : `Directions`}
                  </a>
                </div>

                <Separator className="mb-2"/>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {t("applications.workingDays")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.working_days.map((wd) => (
                      <Badge
                        key={wd.day_of_week}
                        variant="outline"
                        className="text-xs"
                      >
                        {tDoctorDashboard(`schedule.days.${wd.day_of_week.toLowerCase()}`)}{" "}
                        {getTimeIn12HourFormat(wd.start_time, locale)} – {getTimeIn12HourFormat(wd.end_time, locale)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
