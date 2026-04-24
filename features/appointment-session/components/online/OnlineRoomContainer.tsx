"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  UID,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/useToast";
import { Role } from "@/types";
import { useUserStore } from "@/stores/useUserStore";
import { useSoapDraftStore } from "@/stores/useSoapDraftStore";
import {
  useAgoraToken,
  useAudioUploadUrl,
  useProcessAudioAi,
  useUploadAudioFile,
} from "../../query/useAppointmentSession.query";
import { parseAppointmentStart } from "../../utils/sessionWindow";
import { useSessionGate } from "../../hooks/useSessionGate";
import { guessOnlineAudioKeys } from "../../api/session.api";
import {
  useDailySchedule,
  useRescheduleAppointment,
} from "@/features/dashboards/doctor-dashboard/query/useAppointments.query";

type AgoraSDK = (typeof import("agora-rtc-sdk-ng"))["default"];

let agoraSDKPromise: Promise<AgoraSDK> | null = null;

const loadAgoraSDK = async (): Promise<AgoraSDK> => {
  if (!agoraSDKPromise) {
    agoraSDKPromise = import("agora-rtc-sdk-ng").then(
      (module) => module.default,
    );
  }
  return agoraSDKPromise;
};

const stringToNumericUid = (str: string): number => {
  let hash = 0;
  for (let index = 0; index < str.length; index += 1) {
    const char = str.charCodeAt(index);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return Math.abs(hash);
};

const addMinutesToDate = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

const RECORDING_START_MAX_RETRIES = 4;
const RECORDING_START_RETRY_DELAY_MS = 700;

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
}

interface ChatStreamMessagePayload {
  kind: "chat";
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface SessionControlStreamMessagePayload {
  kind: "session-control";
  id: string;
  senderId: string;
  senderName: string;
  action: "ended" | "extended";
  minutes?: number;
  newEndAt?: string;
  timestamp: number;
}

type AgoraStreamMessagePayload =
  | ChatStreamMessagePayload
  | SessionControlStreamMessagePayload;

const decodeStreamMessagePayload = (
  payload: string | Uint8Array,
): AgoraStreamMessagePayload | null => {
  try {
    const raw =
      typeof payload === "string" ? payload : new TextDecoder().decode(payload);
    const parsed = JSON.parse(raw) as AgoraStreamMessagePayload;

    if (parsed.kind === "chat") {
      if (!parsed.id || !parsed.senderId || !parsed.text) return null;
      return parsed;
    }

    if (parsed.kind === "session-control") {
      if (!parsed.id || !parsed.senderId || !parsed.action) return null;
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
};

const sendRtcStreamMessage = async (
  client: IAgoraRTCClient,
  payload: AgoraStreamMessagePayload,
): Promise<void> => {
  const clientWithStream = client as IAgoraRTCClient & {
    sendStreamMessage?: (message: string | Uint8Array) => Promise<void>;
  };

  if (typeof clientWithStream.sendStreamMessage !== "function") {
    throw new Error("stream_message_not_supported");
  }

  await clientWithStream.sendStreamMessage(JSON.stringify(payload));
};

export interface RemoteParticipant {
  id: string;
  name: string;
  avatarSrc?: string | null;
  videoTrack: IAgoraRTCRemoteUser["videoTrack"];
}

export interface OnlineRoomPresentationalProps {
  isJoining: boolean;
  joined: boolean;
  isRecording: boolean;
  sessionStartAt: Date | null;
  sessionEndAt: Date | null;
  localVideoTrack: ILocalVideoTrack | null;
  localParticipantName: string;
  localParticipantAvatarSrc?: string | null;
  remoteParticipants: RemoteParticipant[];
  micOn: boolean;
  camOn: boolean;
  displayName: string;
  chatMessages: ChatMessage[];
  controlsDisabled: boolean;
  routeRole: "doctor" | "patient";
  canExtendMeeting: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onSendMessage: (text: string) => void;
  onLeave: () => Promise<void>;
  onEndConsultation: () => Promise<void>;
  onExtendMeeting: (minutes: number) => Promise<void>;
  tSession: (key: string, values?: Record<string, string | number>) => string;
  tCommon: (key: string) => string;
}

export interface OnlineRoomContainerProps {
  appointmentId: string;
  routeRole: "doctor" | "patient";
  startAt?: string | null;
  endAt?: string | null;
  doctorName?: string | null;
  doctorPhoto?: string | null;
  patientName?: string | null;
  patientPhoto?: string | null;
  initialMicId?: string | null;
  initialCamId?: string | null;
  initialMicOn?: boolean;
  initialCamOn?: boolean;
  children: (props: OnlineRoomPresentationalProps) => ReactNode;
}

export function OnlineRoomContainer({
  appointmentId,
  routeRole,
  startAt,
  endAt,
  doctorName,
  doctorPhoto,
  patientName,
  patientPhoto,
  initialMicId,
  initialCamId,
  initialMicOn = true,
  initialCamOn = true,
  children,
}: OnlineRoomContainerProps) {
  const router = useRouter();
  const tSession = useTranslations("doctorDashboard.sessions");
  const tCommon = useTranslations("common");

  const user = useUserStore((state) => state.user);
  const sessionRole =
    routeRole === "doctor" || user?.role === Role.DOCTOR ? "DOCTOR" : "PATIENT";

  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [micOn, setMicOnState] = useState(initialMicOn);
  const [camOn, setCamOnState] = useState(initialCamOn);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionEndAt, setSessionEndAt] = useState<Date | null>(() => {
    if (endAt) return parseAppointmentStart(endAt);
    return parseAppointmentStart(startAt || "");
  });
  const [isTerminated, setIsTerminated] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const leavingRef = useRef(false);
  const joiningRef = useRef(false);
  const joinedRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingRetryTimeoutRef = useRef<number | null>(null);
  const recordingRetryCountRef = useRef(0);
  const terminationMessageSentRef = useRef(false);
  const leaveMeetingRef = useRef<
    | ((args: { shouldNavigate: boolean; terminate: boolean }) => Promise<void>)
    | null
  >(null);

  const { setStatus, setRecordingKey, setDraft, setError } =
    useSoapDraftStore();

  const tokenQuery = useAgoraToken(appointmentId, Boolean(appointmentId));
  const uploadUrlMutation = useAudioUploadUrl();
  const uploadFileMutation = useUploadAudioFile();
  const processMutation = useProcessAudioAi();
  const rescheduleMutation = useRescheduleAppointment();

  const sessionDate = useMemo(() => {
    if (!startAt) return "";
    return startAt.slice(0, 10);
  }, [startAt]);

  const dailyScheduleQuery = useDailySchedule(
    routeRole === "doctor" ? sessionDate : "",
  );

  const backPath =
    routeRole === "doctor"
      ? "/doctor-dashboard/appointments"
      : "/dashboard/appointments";

  const startDate = useMemo(
    () => parseAppointmentStart(startAt || ""),
    [startAt],
  );
  const gate = useSessionGate(startDate, 5);

  useEffect(() => {
    const terminated = window.sessionStorage.getItem(
      `appointment-session-terminated:${appointmentId}`,
    );

    if (terminated === "true") {
      setIsTerminated(true);
      router.replace(backPath);
    }
  }, [appointmentId, backPath, router]);

  const consultationEndTimeoutMs = useMemo(() => {
    if (!sessionEndAt) return null;

    const remainingMs = sessionEndAt.getTime() - Date.now();
    return remainingMs > 0 ? remainingMs : 0;
  }, [sessionEndAt]);

  const nextScheduleAppointment = useMemo(() => {
    const appointments = dailyScheduleQuery.data?.data ?? [];
    if (!startDate) return null;

    const ordered = [...appointments].sort((left, right) => {
      const leftStart =
        parseAppointmentStart(
          left.appointment_date,
          left.start_time,
        )?.getTime() ?? 0;
      const rightStart =
        parseAppointmentStart(
          right.appointment_date,
          right.start_time,
        )?.getTime() ?? 0;
      return leftStart - rightStart;
    });

    const currentIndex = ordered.findIndex((item) => item.id === appointmentId);
    if (currentIndex >= 0) {
      return ordered[currentIndex + 1] ?? null;
    }

    const currentEndTime = sessionEndAt?.getTime() ?? startDate.getTime();
    return (
      ordered.find((item) => {
        const startTime =
          parseAppointmentStart(
            item.appointment_date,
            item.start_time,
          )?.getTime() ?? 0;
        return startTime >= currentEndTime;
      }) ?? null
    );
  }, [appointmentId, dailyScheduleQuery.data?.data, sessionEndAt, startDate]);

  const displayName =
    routeRole === "doctor"
      ? `${tCommon("doctor")}${user?.name || ""}`
      : (user?.name ?? tSession("meeting.you"));

  const localParticipantAvatarSrc =
    user?.photo_url || user?.profilePicture || undefined;

  const remoteParticipantName =
    routeRole === "doctor"
      ? patientName || tSession("meeting.participant")
      : `${tCommon("doctor")}${doctorName || tSession("meeting.participant")}`;

  const remoteParticipantAvatarSrc =
    routeRole === "doctor"
      ? patientPhoto || undefined
      : doctorPhoto || undefined;

  const remoteParticipants = useMemo(() => {
    return remoteUsers.map((remoteUser) => ({
      id: String(remoteUser.uid),
      name: remoteParticipantName,
      avatarSrc: remoteParticipantAvatarSrc,
      videoTrack: remoteUser.videoTrack,
    }));
  }, [remoteParticipantAvatarSrc, remoteParticipantName, remoteUsers]);

  const stopRecorderAndUpload = useCallback(async (): Promise<void> => {
    const recorder = recorderRef.current;
    let blob = new Blob([], { type: "audio/webm" });

    if (recorder) {
      blob = await new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          resolve(
            new Blob(chunksRef.current, {
              type: recorder.mimeType || "audio/webm",
            }),
          );
        };
        recorder.onerror = () => reject(new Error("recording_error"));
        if (recorder.state !== "inactive") {
          recorder.stop();
        } else {
          resolve(new Blob([], { type: "audio/webm" }));
        }
      });
    }

    recorderRef.current = null;
    setIsRecording(false);

    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    try {
      setStatus(appointmentId, "uploading");
      const uploadUrlResponse = await uploadUrlMutation.mutateAsync({
        appointmentId,
        userType: sessionRole,
      });

      const uploadData = uploadUrlResponse.data;
      if (!uploadData?.uploadUrl || !uploadData.objectKey) {
        throw new Error("upload_url_missing");
      }

      await uploadFileMutation.mutateAsync({
        uploadUrl: uploadData.uploadUrl,
        audioBlob: blob,
      });

      setRecordingKey(appointmentId, sessionRole, uploadData.objectKey);

      const guessedKeys = guessOnlineAudioKeys(appointmentId);
      const doctorKey =
        sessionRole === "DOCTOR" ? uploadData.objectKey : guessedKeys.doctorKey;
      const patientKey =
        sessionRole === "PATIENT"
          ? uploadData.objectKey
          : guessedKeys.patientKey;

      setStatus(appointmentId, "processing");
      const processResponse = await processMutation.mutateAsync({
        appointmentId,
        payload: { doctorKey, patientKey },
      });

      if (processResponse.data?.SOAP) {
        setDraft(appointmentId, processResponse.data.SOAP);
      }
    } catch {
      setError(appointmentId, tSession("errors.processingQueued"));
    }
  }, [
    appointmentId,
    processMutation,
    sessionRole,
    setDraft,
    setError,
    setRecordingKey,
    setStatus,
    tSession,
    uploadFileMutation,
    uploadUrlMutation,
  ]);

  const clearRecordingRetry = useCallback(() => {
    if (recordingRetryTimeoutRef.current) {
      window.clearTimeout(recordingRetryTimeoutRef.current);
      recordingRetryTimeoutRef.current = null;
    }
    recordingRetryCountRef.current = 0;
  }, []);

  const broadcastSessionControl = useCallback(
    async (
      action: "ended" | "extended",
      extra?: { minutes?: number; newEndAt?: Date },
    ) => {
      const client = clientRef.current;
      const uniqueUserId = user?.id || user?.email || user?.username;
      if (!client || !uniqueUserId) return;

      const payload: SessionControlStreamMessagePayload = {
        kind: "session-control",
        id: crypto.randomUUID(),
        senderId: uniqueUserId,
        senderName: displayName,
        action,
        minutes: extra?.minutes,
        newEndAt: extra?.newEndAt?.toISOString(),
        timestamp: Date.now(),
      };

      await sendRtcStreamMessage(client, payload);
    },
    [displayName, user?.email, user?.id, user?.username],
  );

  const leaveMeeting = useCallback(
    async ({
      shouldNavigate,
      terminate,
    }: {
      shouldNavigate: boolean;
      terminate: boolean;
    }) => {
      if (leavingRef.current) return;
      leavingRef.current = true;
      clearRecordingRetry();

      try {
        if (terminate && !terminationMessageSentRef.current) {
          terminationMessageSentRef.current = true;
          setIsTerminated(true);
          window.sessionStorage.setItem(
            `appointment-session-terminated:${appointmentId}`,
            "true",
          );
          await broadcastSessionControl("ended");
        }

        if (joinedRef.current) {
          await stopRecorderAndUpload();
        }

        if (localAudioTrack) {
          localAudioTrack.stop();
          localAudioTrack.close();
        }

        if (localVideoTrack) {
          localVideoTrack.stop();
          localVideoTrack.close();
        }

        if (clientRef.current) {
          clientRef.current.removeAllListeners();
          await clientRef.current.leave();
        }

        clientRef.current = null;
        joinedRef.current = false;
        setJoined(false);
        setLocalAudioTrack(null);
        setLocalVideoTrack(null);
        setRemoteUsers([]);
        setChatMessages([]);
      } catch {
        // cleanup only
      } finally {
        leavingRef.current = false;
        if (shouldNavigate) {
          router.push(backPath);
        }
      }
    },
    [
      appointmentId,
      backPath,
      broadcastSessionControl,
      clearRecordingRetry,
      localAudioTrack,
      localVideoTrack,
      router,
      stopRecorderAndUpload,
    ],
  );

  useEffect(() => {
    leaveMeetingRef.current = leaveMeeting;
  }, [leaveMeeting]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (!joined || isTerminated || recorderRef.current) return false;

    if (typeof MediaRecorder === "undefined") {
      toast({
        title: tCommon("error"),
        description: tSession("errors.recordingNotSupported"),
        variant: "destructive",
      });
      setStatus(appointmentId, "failed");
      setError(appointmentId, tSession("errors.recordingNotSupported"));
      return false;
    }

    if (!localAudioTrack) {
      return false;
    }

    const mediaTrack = localAudioTrack.getMediaStreamTrack();
    if (!mediaTrack || mediaTrack.readyState !== "live") {
      return false;
    }

    const stream = new MediaStream([mediaTrack]);
    const preferredMimeType = MediaRecorder.isTypeSupported(
      "audio/webm;codecs=opus",
    )
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    const recorder = new MediaRecorder(stream, { mimeType: preferredMimeType });
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    try {
      recorder.start(1000);
      recorderRef.current = recorder;
      setIsRecording(true);
      setStatus(appointmentId, "recording");
      clearRecordingRetry();

      recordingTimerRef.current = window.setInterval(() => {
        // heartbeat only
      }, 1000);
      return true;
    } catch {
      return false;
    }
  }, [
    appointmentId,
    clearRecordingRetry,
    joined,
    isTerminated,
    localAudioTrack,
    setError,
    setStatus,
    tCommon,
    tSession,
  ]);

  const hasRemoteParticipant = remoteUsers.length > 0;

  const shouldAutoStartRecording =
    joined &&
    !isTerminated &&
    !isRecording &&
    hasRemoteParticipant &&
    Boolean(localAudioTrack);

  useEffect(() => {
    if (!shouldAutoStartRecording) {
      clearRecordingRetry();
      return;
    }

    let cancelled = false;

    const tryStartRecording = async () => {
      const started = await startRecording();

      if (cancelled || started) {
        return;
      }

      recordingRetryCountRef.current += 1;

      if (recordingRetryCountRef.current >= RECORDING_START_MAX_RETRIES) {
        clearRecordingRetry();
        setStatus(appointmentId, "failed");
        setError(appointmentId, tSession("errors.recordingStartFailed"));
        toast({
          title: tCommon("error"),
          description: tSession("errors.recordingStartFailed"),
          variant: "destructive",
        });
        return;
      }

      recordingRetryTimeoutRef.current = window.setTimeout(() => {
        void tryStartRecording();
      }, RECORDING_START_RETRY_DELAY_MS);
    };

    void tryStartRecording();

    return () => {
      cancelled = true;
      if (recordingRetryTimeoutRef.current) {
        window.clearTimeout(recordingRetryTimeoutRef.current);
        recordingRetryTimeoutRef.current = null;
      }
    };
  }, [
    appointmentId,
    clearRecordingRetry,
    setError,
    setStatus,
    shouldAutoStartRecording,
    startRecording,
    tCommon,
    tSession,
  ]);

  const setSessionEndFromMessage = useCallback(
    (message: SessionControlStreamMessagePayload) => {
      if (message.action === "ended") {
        setIsTerminated(true);
        window.sessionStorage.setItem(
          `appointment-session-terminated:${appointmentId}`,
          "true",
        );
        void leaveMeeting({ shouldNavigate: true, terminate: false });
        return;
      }

      if (message.action === "extended") {
        if (message.newEndAt) {
          setSessionEndAt(new Date(message.newEndAt));
          return;
        }

        if (message.minutes && sessionEndAt) {
          setSessionEndAt(addMinutesToDate(sessionEndAt, message.minutes));
        }
      }
    },
    [appointmentId, leaveMeeting, sessionEndAt],
  );

  const extendMeeting = useCallback(
    async (extensionMinutes: number) => {
      if (routeRole !== "doctor" || !sessionEndAt) return;

      const updatedEndAt = addMinutesToDate(sessionEndAt, extensionMinutes);
      setSessionEndAt(updatedEndAt);

      if (nextScheduleAppointment) {
        await rescheduleMutation.mutateAsync({
          appointmentId: nextScheduleAppointment.id,
          minutes: extensionMinutes,
        });
      }

      await broadcastSessionControl("extended", {
        minutes: extensionMinutes,
        newEndAt: updatedEndAt,
      });

      toast({
        title: tCommon("success"),
        description: tSession("meeting.extendedSuccessfully", {
          minutes: extensionMinutes,
        }),
      });
    },
    [
      broadcastSessionControl,
      nextScheduleAppointment,
      rescheduleMutation,
      routeRole,
      sessionEndAt,
      tCommon,
      tSession,
    ],
  );

  const handleEndConsultation = useCallback(async () => {
    await leaveMeeting({ shouldNavigate: true, terminate: true });
  }, [leaveMeeting]);

  const handleLeaveOnly = useCallback(async () => {
    await leaveMeeting({ shouldNavigate: true, terminate: false });
  }, [leaveMeeting]);

  const toggleMic = useCallback(async () => {
    if (!localAudioTrack) return;
    const next = !micOn;
    try {
      await localAudioTrack.setEnabled(next);
      setMicOnState(next);
    } catch {
      toast({
        title: tCommon("error"),
        description: tSession("errors.joinFailed"),
        variant: "destructive",
      });
    }
  }, [localAudioTrack, micOn, tCommon, tSession]);

  const toggleCam = useCallback(async () => {
    if (!localVideoTrack) return;
    const next = !camOn;
    try {
      await localVideoTrack.setEnabled(next);
      setCamOnState(next);
    } catch {
      toast({
        title: tCommon("error"),
        description: tSession("errors.joinFailed"),
        variant: "destructive",
      });
    }
  }, [camOn, localVideoTrack, tCommon, tSession]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      const client = clientRef.current;
      const uniqueUserId = user?.id || user?.email || user?.username;

      if (!trimmed || !uniqueUserId || !client || !joined) return;

      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: uniqueUserId,
        senderName: displayName,
        text: trimmed,
        timestamp: Date.now(),
        isOwn: true,
      };

      setChatMessages((prev) => [...prev, msg]);

      const payload: ChatStreamMessagePayload = {
        kind: "chat",
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        text: msg.text,
        timestamp: msg.timestamp,
      };

      void sendRtcStreamMessage(client, payload).catch(() => {
        toast({
          title: tCommon("error"),
          description: tSession("errors.messageSendFailed"),
          variant: "destructive",
        });
      });
    },
    [displayName, joined, tCommon, tSession, user],
  );

  useEffect(() => {
    if (gate.isTooEarly || isTerminated) {
      return;
    }

    const uniqueUserId = user?.id || user?.email || user?.username;

    if (
      !tokenQuery.data?.data ||
      !uniqueUserId ||
      clientRef.current ||
      joiningRef.current
    ) {
      return;
    }

    const join = async () => {
      joiningRef.current = true;
      setIsJoining(true);

      try {
        const AgoraRTC = await loadAgoraSDK();
        const tokenData = tokenQuery.data.data;

        if (!tokenData?.token || !tokenData.appId) {
          throw new Error("token_missing");
        }

        const channelName = tokenData.channelName || appointmentId;

        let finalUid: number | string | null = null;
        if (tokenData.uid !== undefined && tokenData.uid !== null) {
          finalUid = tokenData.uid;
        }

        if (finalUid === null && uniqueUserId) {
          finalUid = stringToNumericUid(uniqueUserId);
        }

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        const syncRemoteUsers = () => {
          setRemoteUsers([...client.remoteUsers]);
        };

        const subscribeRemoteTrack = async (
          remoteUser: IAgoraRTCRemoteUser,
          mediaType: "audio" | "video",
        ) => {
          try {
            await client.subscribe(remoteUser, mediaType);
            if (mediaType === "audio") {
              remoteUser.audioTrack?.play();
            }
          } finally {
            syncRemoteUsers();
          }
        };

        client.on("user-joined", () => {
          syncRemoteUsers();
        });

        client.on("user-published", (remoteUser, mediaType) => {
          if (mediaType !== "audio" && mediaType !== "video") {
            syncRemoteUsers();
            return;
          }
          void subscribeRemoteTrack(remoteUser, mediaType);
        });

        client.on("user-unpublished", () => {
          syncRemoteUsers();
        });

        client.on("user-left", () => {
          syncRemoteUsers();
        });

        client.on(
          "stream-message",
          (_uid: UID, payload: string | Uint8Array) => {
            const parsed = decodeStreamMessagePayload(payload);
            if (!parsed) return;

            if (parsed.kind === "chat") {
              setChatMessages((prev) => {
                if (prev.some((item) => item.id === parsed.id)) return prev;
                return [
                  ...prev,
                  {
                    id: parsed.id,
                    senderId: parsed.senderId,
                    senderName: parsed.senderName,
                    text: parsed.text,
                    timestamp: parsed.timestamp,
                    isOwn: parsed.senderId === uniqueUserId,
                  },
                ];
              });
              return;
            }

            if (parsed.kind === "session-control") {
              setSessionEndFromMessage(parsed);
            }
          },
        );

        await client.join(
          tokenData.appId,
          channelName,
          tokenData.token,
          finalUid,
        );

        const initialRemote = client.remoteUsers;
        for (const existingUser of initialRemote) {
          if (existingUser.hasAudio) {
            await subscribeRemoteTrack(existingUser, "audio");
          }
          if (existingUser.hasVideo) {
            await subscribeRemoteTrack(existingUser, "video");
          }
        }
        syncRemoteUsers();

        const [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks(
            initialMicId ? { microphoneId: initialMicId } : undefined,
            initialCamId ? { cameraId: initialCamId } : undefined,
          );

        await client.publish([audioTrack, videoTrack]);

        if (!initialMicOn) {
          await audioTrack.setEnabled(false);
        }
        if (!initialCamOn) {
          await videoTrack.setEnabled(false);
        }

        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        setMicOnState(initialMicOn);
        setCamOnState(initialCamOn);
        setJoined(true);
        joinedRef.current = true;
      } catch (error: any) {
        if (
          leavingRef.current ||
          error?.message?.includes("OPERATION_ABORTED")
        ) {
          return;
        }

        if (clientRef.current) {
          clientRef.current.removeAllListeners();
          void clientRef.current.leave().catch(() => {});
          clientRef.current = null;
        }

        toast({
          title: tCommon("error"),
          description: tSession("errors.joinFailed"),
          variant: "destructive",
        });
        router.push(backPath);
      } finally {
        joiningRef.current = false;
        setIsJoining(false);
      }
    };

    void join();
  }, [
    appointmentId,
    backPath,
    gate.isTooEarly,
    initialCamId,
    initialCamOn,
    initialMicId,
    initialMicOn,
    isTerminated,
    router,
    setSessionEndFromMessage,
    tCommon,
    tSession,
    tokenQuery.data?.data,
    user?.email,
    user?.id,
    user?.username,
  ]);

  useEffect(() => {
    if (!joined || isTerminated || consultationEndTimeoutMs === null) return;

    if (consultationEndTimeoutMs === 0) {
      void handleEndConsultation();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void handleEndConsultation();
    }, consultationEndTimeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [consultationEndTimeoutMs, handleEndConsultation, isTerminated, joined]);

  useEffect(() => {
    return () => {
      void leaveMeetingRef.current?.({
        shouldNavigate: false,
        terminate: false,
      });
    };
  }, []);

  if (isTerminated) {
    return <></>;
  }

  return (
    <>
      {children({
        isJoining,
        joined,
        isRecording,
        sessionStartAt: startDate,
        sessionEndAt,
        localVideoTrack,
        localParticipantName: displayName,
        localParticipantAvatarSrc,
        remoteParticipants,
        micOn,
        camOn,
        displayName,
        chatMessages,
        controlsDisabled: !joined || isTerminated,
        routeRole,
        canExtendMeeting:
          routeRole === "doctor" &&
          joined &&
          !!sessionEndAt &&
          sessionEndAt.getTime() > Date.now(),
        onToggleMic: toggleMic,
        onToggleCam: toggleCam,
        onSendMessage: sendMessage,
        onLeave: async () => {
          await handleLeaveOnly();
        },
        onEndConsultation: async () => {
          await handleEndConsultation();
        },
        onExtendMeeting: async (minutes: number) => {
          await extendMeeting(minutes);
        },
        tSession,
        tCommon,
      })}
    </>
  );
}
