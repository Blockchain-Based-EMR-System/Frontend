import { User, ApiResponse } from "@/types";

export type DashboardUser = User;

export interface GoogleUserDataResponse extends ApiResponse<User> {
  data: User;
  message: string;
}

export interface RawAppointmentData {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  doctor_id: string;
  clinic_id: string | null;
  is_online: boolean;
  slot_duration: number;
  doctor_name: string;
  doctor_profile_pic: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  clinic_name: string | null;
  clinic_address: string | null;
  address_maps_link: string | null;
}

export interface AppointmentDoctor {
  id: string;
  name: string;
  profilePic: string | null;
}

export interface AppointmentClinic {
  id: string | null;
  name: string;
  address: string;
  mapsLink: string;
}

export interface Appointment {
  id: string;
  scheduledTime: string;
  scheduledEndTime: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  doctor: AppointmentDoctor;
  clinic: AppointmentClinic | null;
  online: boolean;
}

export type TodayAppointmentRawResponse = ApiResponse<
  RawAppointmentData | RawAppointmentData[] | null
>;
export type PatientAppointmentsRawResponse = ApiResponse<RawAppointmentData[]>;

export type TodayAppointmentResponse = ApiResponse<Appointment | null>;
export type PatientAppointmentsResponse = ApiResponse<Appointment[]>;
export type AppointmentDetailsResponse = ApiResponse<Appointment>;

export function transformRawAppointment(raw: RawAppointmentData): Appointment {
  return {
    id: raw.id,
    scheduledTime: `${raw.appointment_date}T${raw.start_time}`,
    scheduledEndTime: `${raw.appointment_date}T${raw.end_time}`,
    status: raw.status,
    online: raw.is_online,
    doctor: {
      id: raw.doctor_id,
      name: raw.doctor_name,
      profilePic: raw.doctor_profile_pic,
    },
    clinic: raw.clinic_name
      ? {
          id: raw.clinic_id,
          name: raw.clinic_name,
          address: raw.clinic_address || "",
          mapsLink: raw.address_maps_link || "",
        }
      : null,
  };
}

export interface RescheduleAppointmentRequest {
  newScheduledTime: string;
}
