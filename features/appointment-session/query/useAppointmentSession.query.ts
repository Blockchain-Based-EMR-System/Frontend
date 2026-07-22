import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAgoraToken,
  getAudioUploadUrl,
  processAudioAi,
  uploadAudioToSignedUrl,
} from "../api/session.api";
import { ProcessAudioPayload, RecordingUserType } from "../types/session.types";

export const useAgoraToken = (appointmentId: string, enabled = true) => {
  return useQuery({
    queryKey: ["appointment-session", "agora-token", appointmentId],
    queryFn: () => getAgoraToken(appointmentId),
    enabled: enabled && !!appointmentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAudioUploadUrl = () => {
  return useMutation({
    mutationFn: ({
      appointmentId,
      userType,
    }: {
      appointmentId: string;
      userType: RecordingUserType;
    }) => getAudioUploadUrl(appointmentId, userType),
  });
};

export const useUploadAudioFile = () => {
  return useMutation({
    mutationFn: ({
      uploadUrl,
      audioBlob,
    }: {
      uploadUrl: string;
      audioBlob: Blob;
    }) => uploadAudioToSignedUrl(uploadUrl, audioBlob),
  });
};

export const useProcessAudioAi = () => {
  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string;
      payload: ProcessAudioPayload;
    }) => processAudioAi(appointmentId, payload),
  });
};
