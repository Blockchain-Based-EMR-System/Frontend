import { create } from "zustand";
import {
  DoctorWithClinics,
  Clinic,
} from "@/features/clinics/types/appointments.types";

interface AppointmentNavigationState {
  selectedDoctor: DoctorWithClinics | null;
  selectedClinic: Clinic | null;
  setSelectedDoctor: (doctor: DoctorWithClinics | null) => void;
  setSelectedClinic: (clinic: Clinic | null) => void;
  clearSelection: () => void;
}

export const useAppointmentNavigationStore = create<AppointmentNavigationState>(
  (set) => ({
    selectedDoctor: null,
    selectedClinic: null,
    setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
    setSelectedClinic: (clinic) => set({ selectedClinic: clinic }),
    clearSelection: () => set({ selectedDoctor: null, selectedClinic: null }),
  }),
);
