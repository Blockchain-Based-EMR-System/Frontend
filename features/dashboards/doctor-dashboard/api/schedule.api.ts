import { api } from "@/lib/apiClient";
import {
  GetScheduleResponse,
  CreateScheduleRequest,
  CreateScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
  CheckScheduleAppointmentsRequest,
  CheckScheduleAppointmentsResponse,
  VacationCheckRequest,
  VacationCheckResponse,
  SetVacationRequest,
  SetVacationResponse,
  GetVacationsResponse,
  ClearVacationRequest,
  ClearVacationResponse,
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

export const deleteSchedule = async (
  scheduleId: string,
): Promise<void> => {
  console.log("[API] Deleting schedule:", scheduleId);
  await api.delete("/appointments/doctor/schedule/delete", {
    data: { scheduleId }
  });
  console.log("[API] Schedule deleted successfully");
};

export const checkScheduleAppointments = async (
  data: CheckScheduleAppointmentsRequest,
): Promise<CheckScheduleAppointmentsResponse> => {
  console.log("[API] Checking schedule appointments:", JSON.stringify(data, null, 2));
  const response = await api.get<CheckScheduleAppointmentsResponse>(
    "/appointments/doctor/schedule/check-appointments",
    {
      params: data,
    },
  );
  console.log("[API] Check appointments response:", response);
  return response;
};

export const checkVacation = async (
  data: VacationCheckRequest,
): Promise<VacationCheckResponse> => {
  console.log("[API] Checking vacation:", JSON.stringify(data, null, 2));
  const response = await checkScheduleAppointments(data);
  return response as VacationCheckResponse;
};

export const setVacation = async (
  data: SetVacationRequest,
): Promise<SetVacationResponse> => {
  console.log("[API] Setting vacation:", JSON.stringify(data, null, 2));
  const response = await api.patch<SetVacationResponse>(
    "/appointments/doctor/vacation",
    data,
  );
  console.log("[API] Vacation set response:", response);
  return response;
};

export const checkMultipleVacations = async (
  requests: VacationCheckRequest[],
): Promise<VacationCheckResponse[]> => {
  return Promise.all(requests.map((req) => checkVacation(req)));
};

export const setMultipleVacations = async (
  requests: SetVacationRequest[],
): Promise<SetVacationResponse[]> => {
  return Promise.all(requests.map((req) => setVacation(req)));
};

export const getVacations = async (): Promise<GetVacationsResponse> => {
  console.log("[API] Getting vacation history");
  const response = await api.get<GetVacationsResponse>(
    "/appointments/doctor/vacation",
  );
  console.log("[API] Vacation history response:", response);
  return response;
};

export const clearVacation = async (
  data: ClearVacationRequest,
): Promise<ClearVacationResponse> => {
  console.log("[API] Clearing vacation:", JSON.stringify(data, null, 2));
  const response = await api.patch<ClearVacationResponse>(
    "/appointments/doctor/vacation/clear",
    data,
  );
  console.log("[API] Vacation cleared response:", response);
  return response;
};
