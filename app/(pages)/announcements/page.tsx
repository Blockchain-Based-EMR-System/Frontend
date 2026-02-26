"use client";

import { AnnouncementsContainer } from "@/features/join/nurse/components/announcements/AnnouncementsContainer";
import { AnnouncementsPresentational } from "@/features/join/nurse/components/announcements/AnnouncementsPresentational";

export default function AnnouncementsPage() {
  return (
    <AnnouncementsContainer>
      {(props) => <AnnouncementsPresentational {...props} />}
    </AnnouncementsContainer>
  );
}
