import { api } from "@/lib/apiClient";
import {
  CompleteAppointmentResponse,
  GetNurseAppointmentsParams,
  NurseAppointmentsResponse,
  NurseScheduleResponse,
} from "../types/nurseDashboardTypes";

export async function getNurseSchedule(): Promise<NurseScheduleResponse> {
  return api.get<NurseScheduleResponse>("/nurses/schedule");
}

export async function getNurseAppointments(
  params: GetNurseAppointmentsParams,
): Promise<NurseAppointmentsResponse> {
  return api.get<NurseAppointmentsResponse>("/nurses/appointments", {
    params: {
      doctorId: params.doctorId,
      clinicId: params.clinicId,
      date: params.date,
    },
  });
}

export async function completeNurseAppointment(
  appointmentId: string,
): Promise<CompleteAppointmentResponse> {
  return api.patch<CompleteAppointmentResponse>(
    `/nurses/appointments/${appointmentId}/complete`,
  );
}
