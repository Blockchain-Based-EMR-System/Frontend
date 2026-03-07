import { api } from "@/lib/apiClient";
import {
  DashboardUser,
  GoogleUserDataResponse,
  TodayAppointmentRawResponse,
  PatientAppointmentsRawResponse,
  AppointmentDetailsResponse,
  RescheduleAppointmentRequest,
  Appointment,
  transformRawAppointment,
} from "../types/dashboardTypes";
import { ApiResponse } from "@/types";

export const getCurrentUser = async (): Promise<DashboardUser> => {
  const response = await api.get<GoogleUserDataResponse>(
    "/auth/google/userData",
  );
  return response.data;
};

export const getTodayAppointment = async (): Promise<Appointment | null> => {
  const response = await api.get<TodayAppointmentRawResponse>(
    "/appointments/patient/today-appointment",
  );
  console.log("Raw today appointment response:", response);
  const raw = response.data;
  if (!raw) return null;

  // Backend may return a single object or an array of today's appointments
  const list = Array.isArray(raw) ? raw : [raw];
  if (list.length === 0) return null;

  // Prefer CONFIRMED appointment; fall back to first in list
  const appointment = list.find((a) => a.status === "CONFIRMED") ?? list[0];

  return transformRawAppointment(appointment);
};

export const getPatientAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<PatientAppointmentsRawResponse>(
    "/appointments/patient/appointments",
  );
  if (!response.data) {
    return [];
  }
  return response?.data?.map(transformRawAppointment);
};

export const getAppointmentDetails = async (
  appointmentId: string,
): Promise<AppointmentDetailsResponse> => {
  return api.get<AppointmentDetailsResponse>(
    `/appointments/patient/${appointmentId}`,
  );
};

export const cancelAppointment = async (
  appointmentId: string,
): Promise<ApiResponse<void>> => {
  return api.delete<ApiResponse<void>>(`/appointments/${appointmentId}/cancel`);
};

export const rescheduleAppointment = async (
  appointmentId: string,
  data: RescheduleAppointmentRequest,
): Promise<ApiResponse<void>> => {
  return api.patch<ApiResponse<void>>(
    `/appointments/patient/${appointmentId}/reschedule`,
    data,
  );
};
