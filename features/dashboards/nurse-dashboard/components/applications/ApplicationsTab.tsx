"use client";

import { useNurseApplications } from "@/features/join/nurse";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, ClipboardX } from "lucide-react";

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

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
  const { data, isLoading } = useNurseApplications();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
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

      <div className="grid gap-4">
        {applications.map((app) => {
          const initials = app.doctor.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          const sortedDays = [...app.working_days].sort(
            (a, b) =>
              DAY_ORDER.indexOf(a.day_of_week) -
              DAY_ORDER.indexOf(b.day_of_week),
          );

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
                        <MapPin className="h-3.5 w-3.5" />
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {t("applications.workingDays")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sortedDays.map((wd) => (
                      <Badge
                        key={wd.day_of_week}
                        variant="outline"
                        className="text-xs"
                      >
                        {wd.day_of_week.charAt(0) +
                          wd.day_of_week.slice(1).toLowerCase()}{" "}
                        {wd.start_time}–{wd.end_time}
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
