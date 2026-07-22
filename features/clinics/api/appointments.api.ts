import { api } from "@/lib/apiClient";
import {
  DoctorsResponse,
  ClinicsResponse,
  ClinicDoctorsResponse,
  AvailableDaysResponse,
  AvailableSlotsResponse,
  BookAppointmentRequest,
  BookAppointmentResponse,
  DoctorFilters,
  ClinicFilters,
} from "../types/appointments.types";

export const getDoctors = async (
  lang: string,
  filters?: DoctorFilters,
): Promise<DoctorsResponse> => {
  const params = new URLSearchParams();

  params.append("lang", lang);

  if (filters?.gender) params.append("gender", filters.gender);
  if (filters?.minFees !== undefined)
    params.append("minFees", filters.minFees.toString());
  if (filters?.maxFees !== undefined)
    params.append("maxFees", filters.maxFees.toString());
  if (filters?.isOnline !== undefined)
    params.append("isOnline", filters.isOnline.toString());

  const queryString = params.toString();
  const endpoint = `/appointments/doctors?${queryString}`;

  return api.get<DoctorsResponse>(endpoint);
};

export const getClinics = async (
  lang: string,
  filters?: ClinicFilters,
): Promise<ClinicsResponse> => {
  const params = new URLSearchParams();

  params.append("lang", lang);

  if (filters?.canPayOnline !== undefined)
    params.append("canPayOnline", filters.canPayOnline.toString());

  const queryString = params.toString();
  const endpoint = `/appointments/clinics?${queryString}`;

  return api.get<ClinicsResponse>(endpoint);
};

export const getClinicDoctors = async (
  clinicId: string,
  filters?: Pick<DoctorFilters, "gender" | "minFees" | "maxFees">,
): Promise<ClinicDoctorsResponse> => {
  const params = new URLSearchParams();

  if (filters?.gender) params.append("gender", filters.gender);
  if (filters?.minFees !== undefined)
    params.append("minFees", filters.minFees.toString());
  if (filters?.maxFees !== undefined)
    params.append("maxFees", filters.maxFees.toString());

  const queryString = params.toString();
  const endpoint = `/appointments/clinic/${clinicId}/doctors${queryString ? `?${queryString}` : ""}`;

  return api.get<ClinicDoctorsResponse>(endpoint);
};

export const getAvailableDays = async (
  doctorId: string,
  clinicId?: string | null,
): Promise<AvailableDaysResponse> => {
  console.log("📡 API Call - getAvailableDays");
  console.log("📡 Doctor ID:", doctorId);
  console.log("📡 Clinic ID:", clinicId);

  const params = new URLSearchParams();
  // Only append clinicId if it has an actual value (not null, not undefined)
  if (clinicId !== undefined && clinicId !== null) {
    params.append("clinicId", clinicId);
  }

  const queryString = params.toString();
  const endpoint = `/appointments/doctor/${doctorId}/available-days${queryString ? `?${queryString}` : ""}`;

  console.log("📡 Full endpoint:", endpoint);

  return api.get<AvailableDaysResponse>(endpoint);
};

export const getAvailableSlots = async (
  doctorId: string,
  date: string,
  clinicId?: string | null,
): Promise<AvailableSlotsResponse> => {
  const params = new URLSearchParams();
  params.append("date", date);
  // Only append clinicId if it has an actual value (not null, not undefined)
  if (clinicId !== undefined && clinicId !== null) {
    params.append("clinicId", clinicId);
  }

  const queryString = params.toString();
  const endpoint = `/appointments/doctor/${doctorId}/available-slots?${queryString}`;

  return api.get<AvailableSlotsResponse>(endpoint);
};

export const bookAppointment = async (
  data: BookAppointmentRequest,
): Promise<BookAppointmentResponse> => {
  return api.post<BookAppointmentResponse>("/appointments/book", data);
};
