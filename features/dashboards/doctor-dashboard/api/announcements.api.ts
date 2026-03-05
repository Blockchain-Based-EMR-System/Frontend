import { api } from "@/lib/apiClient";
import {
  AnnouncementActionResponse,
  ApplicantsResponse,
  CreateAnnouncementRequest,
  DoctorAnnouncementsResponse,
  UpdateAnnouncementRequest,
} from "../types/announcement.types";

export const getDoctorAnnouncements =
  async (): Promise<DoctorAnnouncementsResponse> => {
    return api.get<DoctorAnnouncementsResponse>("/doctors/announcements");
  };

export const createAnnouncement = async (
  data: CreateAnnouncementRequest,
): Promise<AnnouncementActionResponse> => {
  return api.post<AnnouncementActionResponse>("/doctors/announcement", data);
};

export const getAnnouncementApplicants = async (
  announcementId: string,
): Promise<ApplicantsResponse> => {
  return api.get<ApplicantsResponse>(
    `/doctors/announcements/${announcementId}/applicants`,
  );
};

export const approveApplicant = async (
  applicantId: string,
  announcementId: string,
): Promise<AnnouncementActionResponse> => {
  return api.patch<AnnouncementActionResponse>(
    `/doctors/announcements/${applicantId}/approve`,
    undefined,
    { params: { announcementId } },
  );
};

export const rejectApplicant = async (
  applicantId: string,
  announcementId: string,
): Promise<AnnouncementActionResponse> => {
  return api.patch<AnnouncementActionResponse>(
    `/doctors/announcements/${applicantId}/reject`,
    undefined,
    { params: { announcementId } },
  );
};

export const deleteAnnouncement = async (
  announcementId: string,
): Promise<AnnouncementActionResponse> => {
  return api.delete<AnnouncementActionResponse>(
    `/doctors/announcements/${announcementId}`,
  );
};

export const updateAnnouncement = async (
  announcementId: string,
  data: UpdateAnnouncementRequest,
): Promise<AnnouncementActionResponse> => {
  return api.patch<AnnouncementActionResponse>(
    `/doctors/announcements/${announcementId}`,
    data,
  );
};
