export interface NurseScheduleEntry {
  id: string;
  doctor: {
    id: string;
    name: string;
    gender: string;
    profilePic?: string | null;
  };
  clinic: {
    id: string;
    name: string;
    address: string;
    address_maps_link?: string | null;
  };
  working_days: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  }[];
}

export interface NurseAppointmentItem {
  id: string;
  clinic: {
    id: string;
    name: string;
    address: string;
    address_maps_link?: string | null;
  };
  patient: {
    id: string;
    name: string;
    gender: string;
    phone: string;
  };
  status: string;
  slot_duration: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
}

export interface NurseScheduleResponse {
  data: NurseScheduleEntry[];
  messageEn: string;
  messageAr: string;
}

export interface NurseAppointmentsResponse {
  data: NurseAppointmentItem[];
  messageEn: string;
  messageAr: string;
}

export interface CompleteAppointmentResponse {
  messageEn: string;
  messageAr: string;
}

export interface GetNurseAppointmentsParams {
  doctorId: string;
  clinicId?: string;
  date: string; // YYYY-MM-DD
}
