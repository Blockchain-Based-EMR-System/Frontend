import { ApiResponse } from "@/types";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AppointmentType = "offline" | "online" | "both";

export interface TimeInterval {
  start: string; 
  end: string; 
}

export interface ScheduleEntry {
  id: string;
  clinicId: string | null;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
  isOnline: boolean;
  isActive: boolean;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface CreateScheduleRequest {
  clinicId: string | null;
  workingDay: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
  isOnline: boolean;
}

export interface DayConfiguration {
  day: DayOfWeek;
  isActive: boolean;
  slotDuration: number;
  bufferTime: number;
  appointmentType: AppointmentType;
  offlineInterval?: TimeInterval;
  onlineInterval?: TimeInterval;
  scheduleId?: string;
  offlineScheduleId?: string; 
  onlineScheduleId?: string;
}

export interface DeleteScheduleResponse extends ApiResponse<{ message: string }> {}

export interface CheckScheduleAppointmentsRequest {
  scheduleId: string;
  startDate?: string; 
  endDate?: string; 
}

export interface CheckScheduleAppointmentsData {
  existing: boolean;
  numOfAppointments: number;
}

export interface CheckScheduleAppointmentsResponse extends ApiResponse<CheckScheduleAppointmentsData> {}

export interface VacationCheckRequest {
  scheduleId: string;
  startDate: string; 
  endDate: string; 
}

export interface VacationCheckData {
  existing: boolean;
  numOfAppointments: number;
}

export interface VacationCheckResponse extends ApiResponse<VacationCheckData> {}

export interface SetVacationRequest {
  scheduleId: string;
  startDate: string; 
  endDate: string;
}

export interface SetVacationResponse extends ApiResponse<{ message: string }> {}

export type VacationStatus = "UPCOMING" | "CURRENT" | "ENDED";

export interface VacationDetail {
  vacationId: string;
  scheduleId: string;
  clinicId: string | null;
  clinicName: string | null;
  clinicAddress: string | null;
  dayOfWeek: string;
  isOnline: boolean;
  status: VacationStatus;
  cancelledAppointments: number;
}

export interface VacationPeriod {
  breakStart: string;
  breakEnd: string;
  vacations: VacationDetail[];
}

export interface GetVacationsResponse {
  success: boolean;
  messageEn: string;
  messageAr: string;
  data: VacationPeriod[];
}

export interface ClearVacationRequest {
  scheduleId: string;
}

export interface ClearVacationResponse {
  success: boolean;
  message: {
    en: string;
    ar: string;
  };
}

export interface CancelVacationRequest {
  vacationId: string;
  scheduleId: string;
}

export interface CancelVacationResponse {
  success: boolean;
  messageEn: string;
  messageAr: string;
}

export interface ScheduleFormData {
  clinicId: string | null;
  days: DayConfiguration[];
}

export interface GetScheduleResponse extends ApiResponse<ScheduleEntry[]> {
  message: string;
}

export interface CreateScheduleResponse extends ApiResponse<undefined> {
  message: string;
}

export interface UpdateScheduleRequest {
  scheduleId: string;
  clinicId: string | null;
  workingDay?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
  bufferTime?: number;
  isOnline?: boolean;
  isActive?: boolean;
  breakStart?: string;
  breakEnd?: string;
}

export interface UpdateScheduleResponse extends ApiResponse<undefined> {
  message: string;
}
