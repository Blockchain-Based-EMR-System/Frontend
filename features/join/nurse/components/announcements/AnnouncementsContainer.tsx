"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useNurseAnnouncements,
  useNurseApplications,
  useApplyToAnnouncement,
} from "../../query/useNurseAnnouncements.query";
import { AnnouncementsPresentationalProps } from "./AnnouncementsPresentational";

export interface AnnouncementsContainerProps {
  children: (props: AnnouncementsPresentationalProps) => React.ReactNode;
}

export function AnnouncementsContainer({
  children,
}: AnnouncementsContainerProps) {
  const tNurse = useTranslations("nurseJoining");
  const tCommon = useTranslations("common");
  const tDoctorDashboard = useTranslations("doctorDashboard");
  const tFields = useTranslations("fields");

  const [applyingId, setApplyingId] = useState<string | null>(null);

  const { data: announcementsData, isLoading: announcementsLoading } =
    useNurseAnnouncements();
  const { data: applicationsData, isLoading: applicationsLoading } =
    useNurseApplications();
  const applyMutation = useApplyToAnnouncement();

  const announcements = announcementsData?.data ?? [];

  const appliedIds = new Set<string>(
    (applicationsData?.data ?? []).map((a) => a.id),
  );

  const handleApply = async (announcementId: string) => {
    setApplyingId(announcementId);
    try {
      await applyMutation.mutateAsync(announcementId);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <>
      {children({
        announcements,
        appliedIds,
        applyingId,
        isLoading: announcementsLoading || applicationsLoading,
        onApply: handleApply,
        t: tNurse,
        tCommon,
        tDoctorDashboard,
        tFields,
      })}
    </>
  );
}
