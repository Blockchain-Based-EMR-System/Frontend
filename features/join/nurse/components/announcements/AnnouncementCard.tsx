"use client";

import { NurseAnnouncement } from "../../types/nurseAnnouncementTypes";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  User,
  CalendarDays,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface AnnouncementCardProps {
  announcement: NurseAnnouncement;
  isApplied: boolean;
  isApplying: boolean;
  onApply: (announcementId: string) => void;
  t: (key: string, values?: Record<string, any>) => string;
  tCommon: (key: string, values?: Record<string, any>) => string;
}

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function formatDay(day: string): string {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

export function AnnouncementCard({
  announcement,
  isApplied,
  isApplying,
  onApply,
  t,
  tCommon,
}: AnnouncementCardProps) {
  const {
    doctor,
    clinic,
    working_days,
    gender,
    max_age,
    years_of_experience,
    notes,
  } = announcement;

  const sortedDays = [...working_days].sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week),
  );

  const doctorInitials = doctor.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        {/* Doctor info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={doctor.profilePic ?? undefined}
              alt={doctor.name}
            />
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {tCommon("doctor")}
              {doctor.name}
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{clinic.name}</span>
            </div>
          </div>
        </div>

        {/* Clinic address */}
        <div className="flex items-start gap-1.5 text-sm text-muted-foreground mt-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{clinic.address}</span>
          {clinic.address_maps_link && (
            <a
              href={clinic.address_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-primary hover:underline flex items-center gap-0.5"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 flex-1 space-y-4">
        {/* Working Schedule */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {t("workingSchedule")}
          </p>
          <div className="space-y-1.5">
            {sortedDays.map((wd) => (
              <div
                key={wd.day_of_week}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">{formatDay(wd.day_of_week)}</span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {wd.start_time} – {wd.end_time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        {(gender ||
          max_age != null ||
          years_of_experience != null ||
          notes) && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {t("requirements")}
              </p>
              <div className="flex flex-wrap gap-2">
                {gender && (
                  <Badge variant="outline" className="text-xs">
                    {t("requiredGender")}:{" "}
                    {gender === "MALE"
                      ? (tCommon("male" as any) ?? "Male")
                      : (tCommon("female" as any) ?? "Female")}
                  </Badge>
                )}
                {max_age != null && (
                  <Badge variant="outline" className="text-xs">
                    {t("maxAge")}: {max_age}
                  </Badge>
                )}
                {years_of_experience != null && (
                  <Badge variant="outline" className="text-xs">
                    {t("yearsOfExperienceReq")}: {years_of_experience}+{" "}
                    {t("years")}
                  </Badge>
                )}
              </div>

              {notes && (
                <div className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <p className="line-clamp-3">{notes}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <Button
          className="w-full"
          disabled={isApplied || isApplying}
          onClick={() => onApply(announcement.id)}
          variant={isApplied ? "outline" : "default"}
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("applying")}
            </>
          ) : isApplied ? (
            t("applied")
          ) : (
            t("apply")
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
