export interface AnnouncementDoctor {
  id: string;
  name: string;
  gender: string;
  profilePic?: string | null;
}

export interface AnnouncementClinic {
  id: string;
  name: string;
  address: string;
  address_maps_link?: string | null;
}

export interface AnnouncementWorkingDay {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface NurseAnnouncement {
  id: string;
  doctor: AnnouncementDoctor;
  clinic: AnnouncementClinic;
  working_days: AnnouncementWorkingDay[];
  status: string;
  gender?: string | null;
  max_age?: number | null;
  years_of_experience?: number | null;
  notes?: string | null;
}

export interface NurseApplication extends NurseAnnouncement {
  application_status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface NurseAnnouncementsResponse {
  data: NurseAnnouncement[];
  messageEn: string;
  messageAr: string;
}

export interface NurseApplicationsResponse {
  data: NurseApplication[];
  messageEn: string;
  messageAr: string;
}

export interface ApplyResponse {
  messageEn: string;
  messageAr: string;
}
