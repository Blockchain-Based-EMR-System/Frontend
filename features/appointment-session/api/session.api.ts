import { api } from "@/lib/apiClient";
import {
  AgoraTokenResponse,
  ProcessAudioPayload,
  ProcessAudioResponse,
  RecordingUserType,
  UploadUrlResponse,
} from "../types/session.types";

export const getAgoraToken = async (
  appointmentId: string,
): Promise<AgoraTokenResponse> => {
  return api.get<AgoraTokenResponse>(
    `/appointments/${appointmentId}/agora-token`,
  );
};

export const getAudioUploadUrl = async (
  appointmentId: string,
  userType: RecordingUserType,
): Promise<UploadUrlResponse> => {
  const params = new URLSearchParams({ userType });
  return api.get<UploadUrlResponse>(
    `/${appointmentId}/upload-url?${params.toString()}`,
  );
};

export const uploadAudioToSignedUrl = async (
  uploadUrl: string,
  audioBlob: Blob,
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": audioBlob.type || "audio/webm",
    },
    body: audioBlob,
  });

  if (!response.ok) {
    throw new Error("Failed to upload audio file");
  }
};

export const processAudioAi = async (
  appointmentId: string,
  payload: ProcessAudioPayload,
): Promise<ProcessAudioResponse> => {
  return api.post<ProcessAudioResponse>(
    `/${appointmentId}/process-audio-ai`,
    payload,
  );
};

export const guessOnlineAudioKeys = (appointmentId: string) => {
  return {
    doctorKey: `appointments/${appointmentId}/DOCTOR.webm`,
    patientKey: `appointments/${appointmentId}/PATIENT.webm`,
  };
};
