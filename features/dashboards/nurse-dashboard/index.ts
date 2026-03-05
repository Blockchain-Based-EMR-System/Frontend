// Container
export { NurseDashboardContainer } from "./components/NurseDashboardContainer";

// Stats
export { NurseDashboardStats } from "./components/NurseDashboardStats";

// Tab components
export { ApplicationsTab } from "./components/applications/ApplicationsTab";
export { ScheduleTab } from "./components/schedule/ScheduleTab";
export { NurseAppointmentsTab } from "./components/appointments/NurseAppointmentsTab";
export { AppointmentSelectionDialog } from "./components/appointments/AppointmentSelectionDialog";

// Types
export type {
  NurseScheduleEntry,
  NurseAppointmentItem,
  NurseScheduleResponse,
  NurseAppointmentsResponse,
  CompleteAppointmentResponse,
  GetNurseAppointmentsParams,
} from "./types/nurseDashboardTypes";

// Queries
export {
  useNurseSchedule,
  useNurseDashboardAppointments,
  useCompleteNurseAppointment,
  NURSE_SCHEDULE_KEY,
  NURSE_APPOINTMENTS_KEY,
} from "./query/useNurseDashboard.query";

// API
export {
  getNurseSchedule,
  getNurseAppointments,
  completeNurseAppointment,
} from "./api/nurseDashboard.api";
