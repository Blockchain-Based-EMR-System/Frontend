import { ApiResponse } from "@/types";

export interface Clinic {
  id: string;
  name: string;
  phone: string;
  canPayOnline: boolean;
  opening_at: string;
  closing_at: string;
  address: string;
  address_maps_link: string;
}

export interface DoctorInClinic {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  age: number;
  specialization: string;
  phone: string;
  fees: number;
  profilePic: string | null;
  is_online?: boolean;
}

export interface SimpleDoctorInClinic {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  age: number;
  phone: string;
  fees: number;
  profilePic: string | null;
}

export interface DoctorWithClinics extends DoctorInClinic {
  clinics: Clinic[];
  is_online?: boolean;
}

export interface ClinicWithDoctors extends Clinic {
  doctors: SimpleDoctorInClinic[];
}

export interface AvailableDay {
  date: string;
  dayOfWeek: string;
  displayDate: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  online: boolean;
}

export interface BookAppointmentRequest {
  doctorId: string;
  clinicId?: string | null;
  scheduledTime: string;
}

export interface DoctorsResponse extends ApiResponse<DoctorWithClinics[]> {}
export interface ClinicsResponse extends ApiResponse<ClinicWithDoctors[]> {}
export interface ClinicDoctorsResponse extends ApiResponse<DoctorInClinic[]> {}
export interface AvailableDaysResponse extends ApiResponse<AvailableDay[]> {}
export interface AvailableSlotsResponse extends ApiResponse<TimeSlot[]> {}
export interface BookAppointmentResponse extends ApiResponse<any> {}

export interface DoctorFilters {
  gender?: "MALE" | "FEMALE";
  minFees?: number;
  maxFees?: number;
  isOnline?: boolean;
}

export interface ClinicFilters {
  canPayOnline?: boolean;
}
