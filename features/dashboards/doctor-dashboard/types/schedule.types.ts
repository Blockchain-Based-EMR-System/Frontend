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
  clinicId?: string;
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
  clinicId?: string;
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
