import { create } from "zustand";

export interface QueueEntry {
  position: number;
  estimatedWaitMinutes: number;
}

interface QueueState {
  entries: Record<string, QueueEntry>;
  update: (appointmentId: string, entry: QueueEntry) => void;
  remove: (appointmentId: string) => void;
  clear: () => void;
  getEntry: (appointmentId: string) => QueueEntry | undefined;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  entries: {},
  update: (appointmentId, entry) =>
    set((state) => ({
      entries: { ...state.entries, [appointmentId]: entry },
    })),
  remove: (appointmentId) =>
    set((state) => {
      const next = { ...state.entries };
      delete next[appointmentId];
      return { entries: next };
    }),
  clear: () => set({ entries: {} }),
  getEntry: (appointmentId) => get().entries[appointmentId],
}));
