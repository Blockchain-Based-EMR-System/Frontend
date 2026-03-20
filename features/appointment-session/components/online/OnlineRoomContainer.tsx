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
import {
  formatCountdown,
  parseAppointmentStart,
} from "../../utils/sessionWindow";
import { useSessionGate } from "../../hooks/useSessionGate";
import { guessOnlineAudioKeys } from "../../api/session.api";

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
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
}

interface AgoraStreamMessagePayload {
  kind: "chat";
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

const decodeStreamMessagePayload = (
  payload: string | Uint8Array,
): AgoraStreamMessagePayload | null => {
  try {
    const raw =
      typeof payload === "string" ? payload : new TextDecoder().decode(payload);
    const parsed = JSON.parse(raw) as AgoraStreamMessagePayload;
    if (parsed.kind !== "chat") return null;
    if (!parsed.id || !parsed.senderId || !parsed.text) return null;
    return parsed;
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
  videoTrack: IAgoraRTCRemoteUser["videoTrack"];
}

export interface OnlineRoomPresentationalProps {
  isJoining: boolean;
  joined: boolean;
  isRecording: boolean;
  recordingLabel: string;
  localVideoTrack: ILocalVideoTrack | null;
  remoteParticipants: RemoteParticipant[];
  micOn: boolean;
  camOn: boolean;
  displayName: string;
  chatMessages: ChatMessage[];
  controlsDisabled: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onSendMessage: (text: string) => void;
  onLeave: () => Promise<void>;
  tSession: (key: string) => string;
  tCommon: (key: string) => string;
}

export interface OnlineRoomContainerProps {
  appointmentId: string;
  routeRole: "doctor" | "patient";
  startAt?: string | null;
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
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micOn, setMicOnState] = useState(initialMicOn);
  const [camOn, setCamOnState] = useState(initialCamOn);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const leavingRef = useRef(false);
  const joiningRef = useRef(false);
  const joinedRef = useRef(false);
  const hadRemoteUserRef = useRef(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const { setStatus, setRecordingKey, setDraft, setError } =
    useSoapDraftStore();

  const tokenQuery = useAgoraToken(appointmentId, Boolean(appointmentId));
  const uploadUrlMutation = useAudioUploadUrl();
  const uploadFileMutation = useUploadAudioFile();
  const processMutation = useProcessAudioAi();

  const backPath =
    routeRole === "doctor"
      ? "/doctor-dashboard/appointments"
      : "/dashboard/appointments";

  const startDate = useMemo(
    () => parseAppointmentStart(startAt || ""),
    [startAt],
  );
  const gate = useSessionGate(startDate, 5);

  const remoteParticipants = useMemo(() => {
    return remoteUsers.map((userItem) => ({
      id: String(userItem.uid),
      name: tSession("meeting.participant"),
      videoTrack: userItem.videoTrack,
    }));
  }, [remoteUsers, tSession]);

  const displayName = user?.name ?? tSession("meeting.you");

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

      const payload: AgoraStreamMessagePayload = {
        kind: "chat",
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        text: msg.text,
        timestamp: msg.timestamp,
      };

      void sendRtcStreamMessage(client, payload).catch((err) => {
        console.error("Chat message send failed:", err);
        toast({
          title: tCommon("error"),
          description: tSession("errors.messageSendFailed"),
          variant: "destructive",
        });
      });
    },
    [displayName, joined, tCommon, tSession, user],
  );

  const stopRecorderAndUpload = async (): Promise<void> => {
    console.log("[AgoraRoom Pipeline] stopRecorderAndUpload initiated.");
    const recorder = recorderRef.current;
    let blob = new Blob([], { type: "audio/webm" });

    if (recorder) {
      console.log("[AgoraRoom Pipeline] Stopping active MediaRecorder...");
      blob = await new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, {
            type: recorder.mimeType || "audio/webm",
          });
          console.log(
            "[AgoraRoom Pipeline] Recorder stopped. Blob size:",
            audioBlob.size,
          );
          resolve(audioBlob);
        };
        recorder.onerror = (e) => {
          console.error("[AgoraRoom Pipeline] Recorder error:", e);
          reject(new Error("recording_error"));
        };
        if (recorder.state !== "inactive") {
          recorder.stop();
        } else {
          console.log(
            "[AgoraRoom Pipeline] Recorder already inactive. Yielding empty blob.",
          );
          resolve(new Blob([], { type: "audio/webm" }));
        }
      });
    } else {
      console.log(
        "[AgoraRoom Pipeline] No active recorder found (mic may have been disabled). Falling back to empty blob.",
      );
    }

    recorderRef.current = null;
    setIsRecording(false);
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
    }

    try {
      console.log(
        "[AgoraRoom Pipeline] Requesting S3 upload URL for userType:",
        sessionRole,
      );
      setStatus(appointmentId, "uploading");
      const uploadUrlResponse = await uploadUrlMutation.mutateAsync({
        appointmentId,
        userType: sessionRole,
      });

      const uploadData = uploadUrlResponse.data;
      if (!uploadData?.uploadUrl || !uploadData.objectKey) {
        throw new Error("upload_url_missing");
      }
      console.log(
        "[AgoraRoom Pipeline] Upload URL received. Key:",
        uploadData.objectKey,
      );

      console.log("[AgoraRoom Pipeline] Uploading audio blob to S3...");
      await uploadFileMutation.mutateAsync({
        uploadUrl: uploadData.uploadUrl,
        audioBlob: blob,
      });
      console.log("[AgoraRoom Pipeline] S3 upload successful.");

      setRecordingKey(appointmentId, sessionRole, uploadData.objectKey);

      const guessedKeys = guessOnlineAudioKeys(appointmentId);
      const doctorKey =
        sessionRole === "DOCTOR" ? uploadData.objectKey : guessedKeys.doctorKey;
      const patientKey =
        sessionRole === "PATIENT"
          ? uploadData.objectKey
          : guessedKeys.patientKey;

      console.log(
        "[AgoraRoom Pipeline] Triggering AI processing. DoctorKey:",
        doctorKey,
        "PatientKey:",
        patientKey,
      );
      setStatus(appointmentId, "processing");
      const processResponse = await processMutation.mutateAsync({
        appointmentId,
        payload: { doctorKey, patientKey },
      });

      console.log(
        "[AgoraRoom Pipeline] AI processing successful! SOAP generated:",
        !!processResponse.data?.SOAP,
      );
      if (processResponse.data?.SOAP) {
        setDraft(appointmentId, processResponse.data.SOAP);
      }
    } catch (err) {
      console.error("[AgoraRoom Pipeline] Pipeline failed:", err);
      setError(appointmentId, tSession("errors.processingQueued"));
    }
  };

  const startRecording = async () => {
    if (!localAudioTrack || recorderRef.current) return;

    const mediaTrack = localAudioTrack.getMediaStreamTrack();
    if (!mediaTrack) return;

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
    } catch (err) {
      console.warn(
        "[AgoraRoom] MediaRecorder start failed (mic likely off):",
        err,
      );
    }

    setIsRecording(true);
    setRecordingSeconds(0);
    setStatus(appointmentId, "recording");

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const leaveMeeting = async (shouldNavigate = true) => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    console.log("[AgoraRoom] Initiating leaveMeeting sequence...");

    try {
      if (joinedRef.current) {
        await stopRecorderAndUpload();
      } else {
        console.log(
          "[AgoraRoom] Skipping Pipeline: joining aborted or unmounted before join completed.",
        );
      }

      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
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
      setJoined(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setRemoteUsers([]);
      setChatMessages([]);
    } catch {
    } finally {
      leavingRef.current = false;
      if (shouldNavigate) {
        router.push(backPath);
      }
    }
  };

  useEffect(() => {
    if (startDate && gate.isTooEarly) {
      console.log("[AgoraRoom] Too early to join, redirecting.");
      router.push(backPath);
      return;
    }

    const uniqueUserId = user?.id || user?.email || user?.username;

    if (
      !tokenQuery.data?.data ||
      !uniqueUserId ||
      clientRef.current ||
      joiningRef.current
    ) {
      console.log("[AgoraRoom] Guard exit:", {
        hasToken: Boolean(tokenQuery.data?.data),
        hasUserId: Boolean(uniqueUserId),
        userObj: user,
        clientExists: Boolean(clientRef.current),
        alreadyJoining: joiningRef.current,
      });
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

        console.log(
          "[AgoraRoom] Joining channel:",
          channelName,
          "as UID:",
          finalUid,
          "role:",
          sessionRole,
        );

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        const syncRemoteUsers = () => {
          const current = [...client.remoteUsers];
          console.log(
            "[AgoraRoom] syncRemoteUsers:",
            current.map((u) => u.uid),
          );
          setRemoteUsers(current);
        };

        const subscribeRemoteTrack = async (
          remoteUser: IAgoraRTCRemoteUser,
          mediaType: "audio" | "video",
        ) => {
          console.log(
            "[AgoraRoom] Subscribing to",
            mediaType,
            "from uid:",
            remoteUser.uid,
          );
          try {
            await client.subscribe(remoteUser, mediaType);
            console.log(
              "[AgoraRoom] Subscribed to",
              mediaType,
              "from uid:",
              remoteUser.uid,
            );
            if (mediaType === "audio") {
              remoteUser.audioTrack?.play();
            }
          } catch (subscribeError) {
            console.error(
              "[AgoraRoom] Failed subscribing to remote track",
              subscribeError,
            );
          } finally {
            syncRemoteUsers();
          }
        };

        client.on("user-joined", (remoteUser: IAgoraRTCRemoteUser) => {
          console.log("[AgoraRoom] user-joined uid:", remoteUser.uid);
          syncRemoteUsers();
        });

        client.on(
          "user-published",
          (
            remoteUser: IAgoraRTCRemoteUser,
            mediaType: "audio" | "video" | "datachannel",
          ) => {
            console.log(
              "[AgoraRoom] user-published uid:",
              remoteUser.uid,
              "type:",
              mediaType,
            );
            if (mediaType !== "audio" && mediaType !== "video") {
              syncRemoteUsers();
              return;
            }
            void subscribeRemoteTrack(remoteUser, mediaType);
          },
        );

        client.on(
          "user-unpublished",
          (
            remoteUser: IAgoraRTCRemoteUser,
            mediaType: "audio" | "video" | "datachannel",
          ) => {
            console.log(
              "[AgoraRoom] user-unpublished uid:",
              remoteUser.uid,
              "type:",
              mediaType,
            );
            syncRemoteUsers();
          },
        );

        client.on("user-left", (remoteUser: IAgoraRTCRemoteUser) => {
          console.log("[AgoraRoom] user-left uid:", remoteUser.uid);
          syncRemoteUsers();
        });

        client.on(
          "stream-message",
          (_uid: UID, payload: string | Uint8Array) => {
            const parsed = decodeStreamMessagePayload(payload);
            if (!parsed) return;

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
          },
        );

        console.log("[AgoraRoom] Calling client.join()...");
        await client.join(
          tokenData.appId,
          channelName,
          tokenData.token,
          finalUid,
        );
        console.log(
          "[AgoraRoom] client.join() succeeded. Actual UID:",
          client.uid,
        );

        const initialRemote = client.remoteUsers;
        console.log(
          "[AgoraRoom] Users already in channel:",
          initialRemote.map((u: IAgoraRTCRemoteUser) => u.uid),
        );
        for (const existingUser of initialRemote) {
          if (existingUser.hasAudio) {
            await subscribeRemoteTrack(existingUser, "audio");
          }
          if (existingUser.hasVideo) {
            await subscribeRemoteTrack(existingUser, "video");
          }
        }
        syncRemoteUsers();

        console.log("[AgoraRoom] Creating local tracks...");
        const [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks(
            initialMicId ? { microphoneId: initialMicId } : undefined,
            initialCamId ? { cameraId: initialCamId } : undefined,
          );

        console.log("[AgoraRoom] Publishing local tracks...");
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
        console.log("[AgoraRoom] Fully joined and published.");
      } catch (error: any) {
        if (
          leavingRef.current ||
          error?.message?.includes("OPERATION_ABORTED")
        ) {
          console.log(
            "[AgoraRoom] Join aborted safely (likely strict-mode unmount).",
          );
          return;
        }

        console.error("[AgoraRoom] Session join failed:", error);
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
    router,
    startDate,
    tCommon,
    tSession,
    tokenQuery.data?.data,
    user?.id,
  ]);

  useEffect(() => {
    if (remoteUsers.length > 0) {
      hadRemoteUserRef.current = true;
    }

    if (!isRecording && joined && remoteUsers.length > 0 && localAudioTrack) {
      void startRecording();
    }

    if (
      routeRole === "patient" &&
      hadRemoteUserRef.current &&
      joined &&
      remoteUsers.length === 0
    ) {
      void leaveMeeting(true);
    }
  }, [joined, localAudioTrack, remoteUsers.length, routeRole, isRecording]);

  useEffect(() => {
    return () => {
      void leaveMeeting(false);
    };
  }, []);

  return (
    <>
      {children({
        isJoining,
        joined,
        isRecording,
        recordingLabel: formatCountdown(recordingSeconds),
        localVideoTrack,
        remoteParticipants,
        micOn,
        camOn,
        displayName,
        chatMessages,
        controlsDisabled: !joined,
        onToggleMic: toggleMic,
        onToggleCam: toggleCam,
        onSendMessage: sendMessage,
        onLeave: async () => {
          await leaveMeeting(true);
        },
        tSession,
        tCommon,
      })}
    </>
  );
}
