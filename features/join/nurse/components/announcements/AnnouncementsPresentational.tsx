"use client";

import { NurseAnnouncement } from "../../types/nurseAnnouncementTypes";
import { AnnouncementCard } from "./AnnouncementCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Megaphone } from "lucide-react";

function AnnouncementCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-3 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

export interface AnnouncementsPresentationalProps {
  announcements: NurseAnnouncement[];
  appliedIds: Set<string>;
  applyingId: string | null;
  isLoading: boolean;
  onApply: (announcementId: string) => void;
  t: (key: string, values?: Record<string, any>) => string;
  tCommon: (key: string, values?: Record<string, any>) => string;
  tDoctorDashboard: (key: string, values?: Record<string, any>) => string;
  tFields: (key: string, values?: Record<string, any>) => string;
}

export function AnnouncementsPresentational({
  announcements,
  appliedIds,
  applyingId,
  isLoading,
  onApply,
  t,
  tCommon,
  tDoctorDashboard,
  tFields
}: AnnouncementsPresentationalProps) {
  return (
    <div className="container mx-auto px-4 py-8 lg:max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("announcementsTitle")}</h1>
        </div>
        <p className="text-muted-foreground">{t("announcementsSubtitle")}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <AnnouncementCardSkeleton key={i} />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">{t("noAnnouncements")}</h2>
          <p className="text-muted-foreground mt-1">
            {t("noAnnouncementsDesc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isApplied={appliedIds.has(announcement.id)}
              isApplying={applyingId === announcement.id}
              onApply={onApply}
              t={t}
              tCommon={tCommon}
              tDoctorDashboard={tDoctorDashboard}
              tFields={tFields}
            />
          ))}
        </div>
      )}
    </div>
  );
}
