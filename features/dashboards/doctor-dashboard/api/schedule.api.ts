import { api } from "@/lib/apiClient";
import {
  GetScheduleResponse,
  CreateScheduleRequest,
  CreateScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
} from "../types/schedule.types";

export const getSchedule = async (): Promise<GetScheduleResponse> => {
  return api.get<GetScheduleResponse>("/appointments/doctor/schedule");
};

export const createSchedule = async (
  data: CreateScheduleRequest,
): Promise<CreateScheduleResponse> => {
  console.log("[API] Sending schedule request:", JSON.stringify(data, null, 2));
  const response = await api.post<CreateScheduleResponse>(
    "/appointments/doctor/schedule",
    data,
  );
  console.log("[API] Schedule response:", response);
  return response;
};

export const updateSchedule = async (
  data: UpdateScheduleRequest,
): Promise<UpdateScheduleResponse> => {
  console.log("[API] Updating schedule:", JSON.stringify(data, null, 2));
  const response = await api.patch<UpdateScheduleResponse>(
    "/appointments/doctor/schedule",
    data,
  );
  console.log("[API] Update response:", response);
  return response;
};

export const createMultipleSchedules = async (
  schedules: CreateScheduleRequest[],
): Promise<CreateScheduleResponse[]> => {
  return Promise.all(schedules.map((schedule) => createSchedule(schedule)));
};
