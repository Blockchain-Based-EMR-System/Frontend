"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  CalendarDays,
  Clock,
  Users,
  Trash2,
  Plus,
  Loader2,
  Megaphone,
  User,
  FileText,
} from "lucide-react";
import {
  useDoctorAnnouncements,
  useDeleteAnnouncement,
} from "../../query/useAnnouncements.query";
import { useClinics } from "../../query/useClinics.query";
import { CreateAnnouncementDialog } from "./CreateAnnouncementDialog";
import { ApplicantsDialog } from "./ApplicantsDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NurseAnnouncement } from "@/features/join/nurse";
import { getTimeIn12HourFormat } from "@/lib/helpers";
import { useLanguage } from "@/contexts/LanguageProvider";

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

type AnnStatus = "PENDING" | "EXPIRED";
const STATUS_VARIANT: Record<
  AnnStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  EXPIRED: "destructive",
};

export function DoctorAnnouncementsTab() {
  const t = useTranslations("doctorDashboard");
  const tFields = useTranslations("fields");
  const { locale } = useLanguage();
  const { data, isLoading } = useDoctorAnnouncements();
  const { data: clinicsData } = useClinics();
  const { mutate: deleteAnn } = useDeleteAnnouncement();

  const [showCreate, setShowCreate] = useState(false);
  const [viewApplicantsId, setViewApplicantsId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const announcements: NurseAnnouncement[] = data?.data ?? [];
  const clinics = clinicsData?.data ?? [];

  const handleDelete = () => {
    if (!deleteId) return;
    setDeletingId(deleteId);
    deleteAnn(deleteId, {
      onSettled: () => {
        setDeleteId(null);
        setDeletingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-40 rounded-md shrink-0" />
        </div>

        {/* Cards grid skeleton */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-xl flex flex-col">
              {/* CardHeader: clinic + status badge + address */}
              <div className="p-4 pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-3.5 w-3.5 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>

              <Skeleton className="h-px w-full" />

              {/* CardContent: schedule + requirements */}
              <div className="p-4 space-y-3 flex-1">
                {/* Schedule label */}
                <Skeleton className="h-3 w-28" />
                {/* Day rows */}
                <div className="space-y-1.5">
                  {Array.from({ length: 3 }).map((_, d) => (
                    <div key={d} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  ))}
                </div>
                {/* Requirement badges */}
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              {/* Footer buttons */}
              <div className="p-4 flex gap-2">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{t("announcements.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("announcements.subtitle")}
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("announcements.postNew")}
          </Button>
        </div>

        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold">
              {t("announcements.noAnnouncements")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("announcements.noAnnouncementsDesc")}
            </p>
            <Button onClick={() => setShowCreate(true)}>
              {t("announcements.postNew")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {announcements.map((ann) => {
              const sortedDays = [...ann.working_days].sort(
                (a, b) =>
                  DAY_ORDER.indexOf(a.day_of_week) -
                  DAY_ORDER.indexOf(b.day_of_week),
              );
              const statusKey = ann.status as AnnStatus;
              const isDeleting = deletingId === ann.id;

              return (
                <Card
                  key={ann.id}
                  className="flex flex-col hover:shadow-sm transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-medium text-foreground">
                          {ann.clinic.name}
                        </span>
                      </div>
                      <Badge variant={STATUS_VARIANT[statusKey]}>
                        {t(`announcements.status.${ann.status}`)}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {ann.clinic.address}
                    </p>
                  </CardHeader>

                  <Separator />

                  <CardContent className="pt-4 flex-1 space-y-3">
                    {/* Schedule */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {t("announcements.workingSchedule")}
                      </p>
                      <div className="space-y-1">
                        {sortedDays.map((wd) => (
                          <div
                            key={wd.day_of_week}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium">
                              {t(
                                `schedule.days.${wd.day_of_week.toLowerCase()}`,
                              )}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {getTimeIn12HourFormat(
                                wd.start_time,
                                locale,
                              )} – {getTimeIn12HourFormat(wd.end_time, locale)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    {(ann.gender ||
                      ann.max_age != null ||
                      ann.years_of_experience != null) && (
                      <div className="flex flex-wrap gap-1.5">
                        {ann.gender && (
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            <User className="h-3 w-3 mr-1" />
                            {ann.gender === "MALE"
                              ? tFields("male")
                              : tFields("female")}
                          </Badge>
                        )}
                        {ann.max_age != null && (
                          <Badge variant="outline" className="text-xs">
                            {locale === "ar"
                              ? `السن الاقصى: ${ann.max_age} سنة`
                              : `Max: ${ann.max_age} years`}
                          </Badge>
                        )}
                        {ann.years_of_experience != null && (
                          <Badge variant="outline" className="text-xs">
                            {locale === "ar"
                              ? `الحد الادنى للخبرة: ${ann.years_of_experience} سنة`
                              : `Min exp: ${ann.years_of_experience} years`}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {ann.notes && (
                      <p className="text-xs text-muted-foreground flex items-start gap-1 line-clamp-2">
                        <FileText className="h-3 w-3 shrink-0 mt-0.5" />
                        {ann.notes}
                      </p>
                    )}
                  </CardContent>

                  <Separator />

                  <div className="p-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 disabled:pointer-events-none"
                      disabled={ann.status === "EXPIRED"}
                      onClick={() => setViewApplicantsId(ann.id)}
                    >
                      <Users className="h-3.5 w-3.5 mr-1.5" />
                      {t("announcements.applicants")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(ann.id)}
                      disabled={isDeleting || ann.status === "EXPIRED"}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <CreateAnnouncementDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        clinics={clinics}
      />

      {/* Applicants dialog */}
      <ApplicantsDialog
        announcementId={viewApplicantsId}
        onClose={() => setViewApplicantsId(null)}
      />

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("announcements.deleteConfirmTitle")}</DialogTitle>
            <DialogDescription>
              {t("announcements.deleteConfirmDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("announcements.deleteConfirmTitle")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
