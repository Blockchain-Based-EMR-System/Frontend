import { api } from "@/lib/apiClient";
import {
  NurseAnnouncementsResponse,
  NurseApplicationsResponse,
  ApplyResponse,
} from "../types/nurseAnnouncementTypes";

export const getNurseAnnouncements =
  async (): Promise<NurseAnnouncementsResponse> => {
    return api.get<NurseAnnouncementsResponse>("/nurses/announcements");
  };

export const getNurseApplications =
  async (): Promise<NurseApplicationsResponse> => {
    return api.get<NurseApplicationsResponse>("/nurses/applications");
  };

export const applyToAnnouncement = async (
  announcementId: string,
): Promise<ApplyResponse> => {
  return api.post<ApplyResponse>(
    `/nurses/announcements/${announcementId}/apply`,
  );
};
