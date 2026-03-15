"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/useToast";
import { useSoapDraftStore } from "@/stores/useSoapDraftStore";
import {
  useAudioUploadUrl,
  useProcessAudioAi,
  useUploadAudioFile,
} from "../../query/useAppointmentSession.query";
import { useSessionGate } from "../../hooks/useSessionGate";
import {
  formatCountdown,
  parseAppointmentStart,
} from "../../utils/sessionWindow";

export interface OfflineSessionPresentationalProps {
  appointmentId: string;
  canStart: boolean;
  isTooEarly: boolean;
  countdown: string;
  microphones: MediaDeviceInfo[];
  selectedMicrophone: string;
  onMicrophoneChange: (value: string) => void;
  isLoadingDevices: boolean;
  isRecording: boolean;
  elapsedLabel: string;
  isBusy: boolean;
  status: string;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  onBack: () => void;
  tSession: (key: string, values?: Record<string, string | number>) => string;
  tCommon: (key: string) => string;
}

export interface OfflineSessionContainerProps {
  appointmentId: string;
  startAt?: string | null;
  children: (props: OfflineSessionPresentationalProps) => ReactNode;
}

export function OfflineSessionContainer({
  appointmentId,
  startAt,
  children,
}: OfflineSessionContainerProps) {
  const router = useRouter();
  const tSession = useTranslations("doctorDashboard.sessions");
  const tCommon = useTranslations("common");

  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const startDate = useMemo(
    () => parseAppointmentStart(startAt || ""),
    [startAt],
  );
  const gate = useSessionGate(startDate, 10);

  const uploadUrlMutation = useAudioUploadUrl();
  const uploadFileMutation = useUploadAudioFile();
  const processAudioMutation = useProcessAudioAi();

  const { setStatus, setDraft, setRecordingKey, setError, byAppointment } =
    useSoapDraftStore();

  const appointmentState = byAppointment[appointmentId];

  const loadMicrophones = async () => {
    setIsLoadingDevices(true);
    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      permissionStream.getTracks().forEach((track) => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput",
      );
      setMicrophones(audioInputs);
      if (!selectedMicrophone && audioInputs.length > 0) {
        setSelectedMicrophone(audioInputs[0].deviceId);
      }
    } catch {
      toast({
        title: tCommon("error"),
        description: tSession("permissions.microphoneDenied"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    void loadMicrophones();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      recorderRef.current?.stop();
    };
  }, []);

  const startRecording = async () => {
    if (gate.isTooEarly) {
      toast({
        title: tCommon("error"),
        description: tSession("meeting.availableIn", {
          time: formatCountdown(gate.secondsUntilEnabled),
        }),
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMicrophone
          ? { deviceId: { exact: selectedMicrophone } }
          : true,
      });

      const preferredMimeType = MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus",
      )
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType: preferredMimeType,
      });

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.start(1000);
      streamRef.current = stream;
      recorderRef.current = recorder;
      setIsRecording(true);
      setElapsedSeconds(0);
      setError(appointmentId, null);
      setStatus(appointmentId, "recording");

      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setStatus(appointmentId, "failed");
      setError(appointmentId, tSession("errors.recordingStartFailed"));
      toast({
        title: tCommon("error"),
        description: tSession("errors.recordingStartFailed"),
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    try {
      const audioBlob = await new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || "audio/webm",
          });
          resolve(blob);
        };
        recorder.onerror = () => reject(new Error("Recorder error"));
        recorder.stop();
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      recorderRef.current = null;

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      setIsRecording(false);
      setStatus(appointmentId, "uploading");

      const uploadUrlResponse = await uploadUrlMutation.mutateAsync({
        appointmentId,
        userType: "MIXED",
      });

      const uploadData = uploadUrlResponse.data;
      if (!uploadData?.uploadUrl || !uploadData.objectKey) {
        throw new Error("Upload URL response is missing data");
      }

      await uploadFileMutation.mutateAsync({
        uploadUrl: uploadData.uploadUrl,
        audioBlob,
      });

      setRecordingKey(appointmentId, "MIXED", uploadData.objectKey);
      setStatus(appointmentId, "processing");

      const processResponse = await processAudioMutation.mutateAsync({
        appointmentId,
        payload: { mixedKey: uploadData.objectKey },
      });

      const soap = processResponse.data?.SOAP;
      if (soap) {
        setDraft(appointmentId, soap);
      }

      toast({
        title: tCommon("success"),
        description: tSession("soap.generated"),
      });

      router.push(
        `/doctor-dashboard/appointments/${appointmentId}/soap-review`,
      );
    } catch {
      setStatus(appointmentId, "failed");
      setError(appointmentId, tSession("errors.offlineProcessingFailed"));
      toast({
        title: tCommon("error"),
        description: tSession("errors.offlineProcessingFailed"),
        variant: "destructive",
      });
    }
  };

  const elapsedLabel = formatCountdown(elapsedSeconds);
  const countdown = formatCountdown(gate.secondsUntilEnabled);

  const status = appointmentState?.status || "idle";

  return (
    <>
      {children({
        appointmentId,
        canStart: gate.canJoin,
        isTooEarly: gate.isTooEarly,
        countdown,
        microphones,
        selectedMicrophone,
        onMicrophoneChange: setSelectedMicrophone,
        isLoadingDevices,
        isRecording,
        elapsedLabel,
        isBusy:
          uploadUrlMutation.isPending ||
          uploadFileMutation.isPending ||
          processAudioMutation.isPending,
        status,
        onStartRecording: startRecording,
        onStopRecording: stopRecording,
        onBack: () => router.push("/doctor-dashboard/appointments"),
        tSession,
        tCommon,
      })}
    </>
  );
}
