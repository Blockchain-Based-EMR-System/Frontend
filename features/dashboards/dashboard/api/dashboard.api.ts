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
  console.log("today appointment response:", response);
  const raw = response.data;
  if (!raw) return null;

  const list = Array.isArray(raw) ? raw : [raw];
  if (list.length === 0) return null;

  const now = Date.now();

  const getTime = (a: (typeof list)[number]) =>
    new Date(`${a.appointment_date}T${a.start_time}Z`).getTime();
  const confirmed = list.filter((a) => a.status === "CONFIRMED");
  const pickClosest = (candidates: typeof list) => {
    const upcoming = candidates.filter((a) => getTime(a) >= now);
    if (upcoming.length > 0) {
      return upcoming.reduce((best, a) =>
        getTime(a) < getTime(best) ? a : best,
      );
    }
    return candidates.reduce((best, a) =>
      getTime(a) > getTime(best) ? a : best,
    );
  };

  const appointment =
    confirmed.length > 0 ? pickClosest(confirmed) : pickClosest(list);

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
