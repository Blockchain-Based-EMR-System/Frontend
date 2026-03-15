import { ApiResponse } from "@/types";

export type SessionMode = "ONLINE" | "OFFLINE";

export type RecordingUserType = "DOCTOR" | "PATIENT" | "MIXED";

export interface AgoraTokenData {
  token: string;
  appId: string;
  uid?: number | string;
  channelName?: string;
}

export type AgoraTokenResponse = ApiResponse<AgoraTokenData>;

export interface UploadUrlData {
  uploadUrl: string;
  objectKey: string;
}

export type UploadUrlResponse = ApiResponse<UploadUrlData>;

export interface ProcessAudioPayload {
  doctorKey?: string;
  patientKey?: string;
  mixedKey?: string;
}

export interface SoapDraft {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface ProcessAudioData {
  SOAP: SoapDraft;
}

export type ProcessAudioResponse = ApiResponse<ProcessAudioData>;

export type SoapDraftStatus =
  | "idle"
  | "recording"
  | "uploading"
  | "processing"
  | "draft-ready"
  | "confirmed"
  | "failed";

export interface SessionGateState {
  canJoin: boolean;
  isTooEarly: boolean;
  hasStarted: boolean;
  secondsUntilEnabled: number;
  secondsUntilStart: number;
}
