import { api } from "@/lib/apiClient";
import {
  DailyScheduleResponse,
  RescheduleAppointmentRequest,
  RescheduleAppointmentResponse,
  CancelAppointmentResponse,
} from "../types/appointment.types";

export const getDailySchedule = async (
  date: string,
): Promise<DailyScheduleResponse> => {
  return api.get<DailyScheduleResponse>(
    `/appointments/doctor/daily-schedule?date=${date}`,
  );
};

export const getTodaySchedule = async (): Promise<DailyScheduleResponse> => {
  return api.get<DailyScheduleResponse>(
    "/appointments/doctor/current-schedule",
  );
};

export const rescheduleAppointment = async (
  appointmentId: string,
  data: RescheduleAppointmentRequest,
): Promise<RescheduleAppointmentResponse> => {
  return api.patch<RescheduleAppointmentResponse>(
    `/appointments/doctor/${appointmentId}/reschedule`,
    data,
  );
};

export const cancelAppointment = async (
  appointmentId: string,
): Promise<CancelAppointmentResponse> => {
  return api.delete<CancelAppointmentResponse>(
    `/appointments/${appointmentId}/cancel`,
  );
};
