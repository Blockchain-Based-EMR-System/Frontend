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
  if (response.data && response.data.id && response.data.appointment_date) {
    const transformed = transformRawAppointment(response.data);
    return transformed;
  }
  return null;
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
