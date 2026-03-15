import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  RecordingUserType,
  SoapDraft,
  SoapDraftStatus,
} from "@/features/appointment-session/types/session.types";

interface AppointmentSoapState {
  status: SoapDraftStatus;
  draft: SoapDraft | null;
  recordingKeys: Partial<Record<RecordingUserType, string>>;
  error: string | null;
  updatedAt: string;
}

interface SoapDraftStore {
  byAppointment: Record<string, AppointmentSoapState>;
  setStatus: (appointmentId: string, status: SoapDraftStatus) => void;
  setDraft: (appointmentId: string, draft: SoapDraft) => void;
  setDraftField: (
    appointmentId: string,
    field: keyof SoapDraft,
    value: string,
  ) => void;
  setRecordingKey: (
    appointmentId: string,
    role: RecordingUserType,
    objectKey: string,
  ) => void;
  setError: (appointmentId: string, error: string | null) => void;
  clearAppointmentState: (appointmentId: string) => void;
}

const createEmptyState = (): AppointmentSoapState => ({
  status: "idle",
  draft: null,
  recordingKeys: {},
  error: null,
  updatedAt: new Date().toISOString(),
});

export const useSoapDraftStore = create<SoapDraftStore>()(
  persist(
    (set, get) => ({
      byAppointment: {},

      setStatus: (appointmentId, status) => {
        const current =
          get().byAppointment[appointmentId] ?? createEmptyState();

        set({
          byAppointment: {
            ...get().byAppointment,
            [appointmentId]: {
              ...current,
              status,
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      setDraft: (appointmentId, draft) => {
        const current =
          get().byAppointment[appointmentId] ?? createEmptyState();

        set({
          byAppointment: {
            ...get().byAppointment,
            [appointmentId]: {
              ...current,
              draft,
              status: "draft-ready",
              error: null,
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      setDraftField: (appointmentId, field, value) => {
        const current =
          get().byAppointment[appointmentId] ?? createEmptyState();

        set({
          byAppointment: {
            ...get().byAppointment,
            [appointmentId]: {
              ...current,
              draft: {
                subjective: current.draft?.subjective || "",
                objective: current.draft?.objective || "",
                assessment: current.draft?.assessment || "",
                plan: current.draft?.plan || "",
                [field]: value,
              },
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      setRecordingKey: (appointmentId, role, objectKey) => {
        const current =
          get().byAppointment[appointmentId] ?? createEmptyState();

        set({
          byAppointment: {
            ...get().byAppointment,
            [appointmentId]: {
              ...current,
              recordingKeys: {
                ...current.recordingKeys,
                [role]: objectKey,
              },
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      setError: (appointmentId, error) => {
        const current =
          get().byAppointment[appointmentId] ?? createEmptyState();

        set({
          byAppointment: {
            ...get().byAppointment,
            [appointmentId]: {
              ...current,
              error,
              status: error ? "failed" : current.status,
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      clearAppointmentState: (appointmentId) => {
        const copy = { ...get().byAppointment };
        delete copy[appointmentId];
        set({ byAppointment: copy });
      },
    }),
    {
      name: "soap-draft-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
