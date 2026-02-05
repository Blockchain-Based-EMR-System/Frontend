import { ApiResponse } from "@/types";

export type AppointmentStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  slot_duration: number;
  patient_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  clinic_name: string | null;
  clinic_address: string | null;
  isOnline?: boolean;
  bufferTime?: number;
}

export interface DailyScheduleResponse {
  data: Appointment[];
  message: {
    en: string;
    ar: string;
  };
}

export interface RescheduleAppointmentRequest {
  minutes: number; 
}

export interface RescheduleAppointmentResponse extends ApiResponse<undefined> {
  message: string;
}

export interface CancelAppointmentResponse {
  success: boolean;
  message: string;
  data: {
    appointmentId: string;
    cancelledAt: string;
  };
}
