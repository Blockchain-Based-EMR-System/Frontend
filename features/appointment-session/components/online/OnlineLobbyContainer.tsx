"use client";

import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/useToast";
import { useUserStore } from "@/stores/useUserStore";
import { useSessionGate } from "../../hooks/useSessionGate";
import {
  formatCountdown,
  parseAppointmentStart,
} from "../../utils/sessionWindow";

type SessionRoleRoute = "doctor" | "patient";

export interface OnlineLobbyPresentationalProps {
  canJoin: boolean;
  isTooEarly: boolean;
  countdown: string;
  displayName: string;
  microphones: MediaDeviceInfo[];
  cameras: MediaDeviceInfo[];
  selectedMicrophone: string;
  selectedCamera: string;
  setSelectedMicrophone: (value: string) => void;
  setSelectedCamera: (value: string) => void;
  micOn: boolean;
  camOn: boolean;
  setMicOn: (value: boolean) => void;
  setCamOn: (value: boolean) => void;
  isLoadingDevices: boolean;
  showPreviewAvatar: boolean;
  micLevel: number;
  isMicDetecting: boolean;
  hasCamera: boolean;
  hasMicrophone: boolean;
  previewRef: RefObject<HTMLVideoElement | null>;
  onJoin: () => void;
  onBack: () => void;
  tSession: (key: string, values?: Record<string, string | number>) => string;
  tCommon: (key: string) => string;
}

export interface OnlineLobbyContainerProps {
  appointmentId: string;
  startAt?: string | null;
  routeRole: SessionRoleRoute;
  children: (props: OnlineLobbyPresentationalProps) => ReactNode;
}

export function OnlineLobbyContainer({
  appointmentId,
  startAt,
  routeRole,
  children,
}: OnlineLobbyContainerProps) {
  const router = useRouter();
  const tSession = useTranslations("doctorDashboard.sessions");
  const tCommon = useTranslations("common");
  const user = useUserStore((state) => state.user);

  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [isMicDetecting, setIsMicDetecting] = useState(false);
  const [hasPreviewVideoTrack, setHasPreviewVideoTrack] = useState(false);

  const previewRef = useRef<HTMLVideoElement | null>(null);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micMeterFrameRef = useRef<number | null>(null);

  const displayName = user?.name || tSession("meeting.you");

  const startDate = useMemo(
    () => parseAppointmentStart(startAt || ""),
    [startAt],
  );
  const gate = useSessionGate(startDate, 5);

  const basePath =
    routeRole === "doctor"
      ? `/doctor-dashboard/appointments/${appointmentId}/online`
      : `/dashboard/appointments/${appointmentId}/online`;

  const appointmentsBackPath =
    routeRole === "doctor"
      ? "/doctor-dashboard/appointments"
      : "/dashboard/appointments";

  const stopMicMeter = useCallback(() => {
    if (micMeterFrameRef.current) {
      window.cancelAnimationFrame(micMeterFrameRef.current);
      micMeterFrameRef.current = null;
    }

    audioSourceRef.current?.disconnect();
    audioAnalyserRef.current?.disconnect();

    if (audioContextRef.current) {
      void audioContextRef.current.close().catch(() => {
      });
    }

    audioSourceRef.current = null;
    audioAnalyserRef.current = null;
    audioContextRef.current = null;
    setMicLevel(0);
    setIsMicDetecting(false);
  }, []);

  const startMicMeter = useCallback(
    (audioTrack: MediaStreamTrack) => {
      stopMicMeter();

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;

      const source = audioContext.createMediaStreamSource(
        new MediaStream([audioTrack]),
      );
      source.connect(analyser);

      audioContextRef.current = audioContext;
      audioAnalyserRef.current = analyser;
      audioSourceRef.current = source;

      const buffer = new Uint8Array(analyser.fftSize);

      const readMicLevel = () => {
        const activeAnalyser = audioAnalyserRef.current;
        if (!activeAnalyser) return;

        activeAnalyser.getByteTimeDomainData(buffer);

        let sumSquares = 0;
        for (let index = 0; index < buffer.length; index += 1) {
          const normalized = (buffer[index] - 128) / 128;
          sumSquares += normalized * normalized;
        }

        const rms = Math.sqrt(sumSquares / buffer.length);
        const normalizedLevel = Math.min(1, rms * 3);
        const asPercent = Math.round(normalizedLevel * 100);

        setMicLevel(asPercent);
        setIsMicDetecting(asPercent > 8);

        micMeterFrameRef.current = window.requestAnimationFrame(readMicLevel);
      };

      micMeterFrameRef.current = window.requestAnimationFrame(readMicLevel);
    },
    [stopMicMeter],
  );

  const stopAllPreviewTracks = useCallback(() => {
    previewStreamRef.current?.getTracks().forEach((track) => track.stop());
    previewStreamRef.current = null;
    audioTrackRef.current = null;
    videoTrackRef.current = null;
    setHasPreviewVideoTrack(false);
    stopMicMeter();
    if (previewRef.current) {
      previewRef.current.srcObject = null;
    }
  }, [stopMicMeter]);

  const loadDevices = async () => {
    setIsLoadingDevices(true);

    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      permissionStream.getTracks().forEach((track) => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((d) => d.kind === "audioinput");
      const videoInputs = devices.filter((d) => d.kind === "videoinput");

      setMicrophones(audioInputs);
      setCameras(videoInputs);

      if (!selectedMicrophone && audioInputs.length > 0) {
        setSelectedMicrophone(audioInputs[0].deviceId);
      }
      if (!selectedCamera && videoInputs.length > 0) {
        setSelectedCamera(videoInputs[0].deviceId);
      }
    } catch {
      toast({
        title: tCommon("error"),
        description: tSession("permissions.cameraMicrophoneDenied"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    void loadDevices();
  }, []);

  useEffect(() => {
    const acquireStream = async () => {
      stopAllPreviewTracks();

      const hasMic = microphones.length > 0;
      const hasCam = cameras.length > 0;

      if (!hasMic && !hasCam) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: hasMic
            ? selectedMicrophone
              ? { deviceId: { exact: selectedMicrophone } }
              : true
            : false,
          video: hasCam
            ? selectedCamera
              ? { deviceId: { exact: selectedCamera } }
              : true
            : false,
        });

        previewStreamRef.current = stream;

        const [videoTrack] = stream.getVideoTracks();
        const [audioTrack] = stream.getAudioTracks();

        videoTrackRef.current = videoTrack ?? null;
        audioTrackRef.current = audioTrack ?? null;

        if (audioTrack) audioTrack.enabled = micOn;
        if (videoTrack) videoTrack.enabled = camOn;

        const hasVideo = Boolean(videoTrack) && camOn;
        setHasPreviewVideoTrack(hasVideo);

        if (audioTrack && micOn) {
          startMicMeter(audioTrack);
        }

        if (previewRef.current && videoTrack) {
          previewRef.current.srcObject = stream;
          await previewRef.current.play();
        } else if (previewRef.current) {
          previewRef.current.srcObject = null;
        }
      } catch {
        setHasPreviewVideoTrack(false);
        stopMicMeter();
      }
    };

    void acquireStream();
  }, [selectedCamera, selectedMicrophone, cameras.length, microphones.length]);

  useEffect(() => {
    const audioTrack = audioTrackRef.current;
    if (audioTrack) {
      audioTrack.enabled = micOn;
      if (micOn) {
        startMicMeter(audioTrack);
      } else {
        stopMicMeter();
        setMicLevel(0);
        setIsMicDetecting(false);
      }
    }
  }, [micOn, startMicMeter, stopMicMeter]);

  useEffect(() => {
    const videoTrack = videoTrackRef.current;
    if (videoTrack) {
      videoTrack.enabled = camOn;
      setHasPreviewVideoTrack(camOn);

      if (previewRef.current) {
        if (!camOn) {
          previewRef.current.srcObject = null;
        } else if (previewStreamRef.current) {
          previewRef.current.srcObject = previewStreamRef.current;
          void previewRef.current.play().catch(() => {
          });
        }
      }
    }
  }, [camOn]);

  useEffect(() => {
    return () => {
      stopAllPreviewTracks();
    };
  }, [stopAllPreviewTracks]);

  const onJoin = () => {
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

    const params = new URLSearchParams();
    if (selectedMicrophone) params.set("mic", selectedMicrophone);
    if (selectedCamera) params.set("cam", selectedCamera);
    params.set("micOn", String(micOn));
    params.set("camOn", String(camOn));
    if (startAt) params.set("startAt", startAt);

    router.push(`${basePath}/room?${params.toString()}`);
  };

  return (
    <>
      {children({
        canJoin: gate.canJoin,
        isTooEarly: gate.isTooEarly,
        countdown: formatCountdown(gate.secondsUntilEnabled),
        displayName,
        microphones,
        cameras,
        selectedMicrophone,
        selectedCamera,
        setSelectedMicrophone,
        setSelectedCamera,
        micOn,
        camOn,
        setMicOn,
        setCamOn,
        isLoadingDevices,
        showPreviewAvatar: !camOn || !hasPreviewVideoTrack,
        micLevel,
        isMicDetecting,
        hasCamera: cameras.length > 0,
        hasMicrophone: microphones.length > 0,
        previewRef,
        onJoin,
        onBack: () => router.push(appointmentsBackPath),
        tSession,
        tCommon,
      })}
    </>
  );
}
