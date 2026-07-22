"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  Send,
  Timer,
  Video,
  VideoOff,
} from "lucide-react";
import type { OnlineRoomPresentationalProps } from "./OnlineRoomContainer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrackTile } from "./TrackTile";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatCountdown,
  getConsultationWindowState,
} from "../../utils/sessionWindow";
import { ExtendMeetingDialog } from "./ExtendMeetingDialog";

function useConsultationCountdown(
  sessionStartAt: Date | null,
  sessionEndAt: Date | null,
) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    if (!sessionStartAt || !sessionEndAt) {
      return {
        label: formatCountdown(0),
        isEndingSoon: false,
      };
    }

    const consultationWindow = getConsultationWindowState(
      sessionStartAt,
      sessionEndAt,
      now,
    );

    return {
      label: formatCountdown(consultationWindow.remainingSeconds),
      isEndingSoon: consultationWindow.isEndingSoon,
    };
  }, [now, sessionEndAt, sessionStartAt]);
}

export function OnlineRoomPresentational({
  isJoining,
  joined,
  isRecording,
  sessionStartAt,
  sessionEndAt,
  localVideoTrack,
  localParticipantName,
  localParticipantAvatarSrc,
  remoteParticipants,
  micOn,
  camOn,
  chatMessages,
  controlsDisabled,
  routeRole,
  canExtendMeeting,
  onToggleMic,
  onToggleCam,
  onSendMessage,
  onLeave,
  onEndConsultation,
  onExtendMeeting,
  tSession,
}: OnlineRoomPresentationalProps) {
  const [messageText, setMessageText] = useState("");
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { label: sessionCountdownLabel, isEndingSoon } =
    useConsultationCountdown(sessionStartAt, sessionEndAt);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageText.trim()) return;
    onSendMessage(messageText);
    setMessageText("");
  };

  const handleLeaveOnly = async () => {
    setIsLeaveDialogOpen(false);
    await onLeave();
  };

  const handleEndConsultation = async () => {
    setIsLeaveDialogOpen(false);
    await onEndConsultation();
  };

  return (
    <>
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tSession("meeting.leaveDialogTitle")}</DialogTitle>
            <DialogDescription>
              {tSession("meeting.leaveDialogDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleLeaveOnly}>
              {tSession("meeting.leaveOnly")}
            </Button>
            {routeRole === "doctor" && (
              <Button variant="destructive" onClick={handleEndConsultation}>
                {tSession("meeting.leaveAndEnd")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle>{tSession("meeting.roomTitle")}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span
                    className={cn(
                      "font-medium",
                      isEndingSoon ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {sessionCountdownLabel}
                  </span>
                </div>
              </div>

              <Badge
                variant={isRecording ? "destructive" : "secondary"}
                className={cn("gap-1", isEndingSoon && "border-destructive/40")}
              >
                <Radio className="h-3.5 w-3.5" />
                {isRecording
                  ? tSession("recording.live")
                  : tSession("recording.waiting")}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {isJoining && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {tSession("meeting.connecting")}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <TrackTile
                  label={tSession("meeting.you")}
                  track={localVideoTrack}
                  showAvatar={!camOn}
                  avatarName={localParticipantName}
                  avatarSrc={localParticipantAvatarSrc}
                  className="border-primary/30"
                />

                {remoteParticipants.length > 0 ? (
                  remoteParticipants.map((participant) => (
                    <TrackTile
                      key={participant.id}
                      label={participant.name}
                      track={participant.videoTrack || null}
                      showAvatar={!participant.videoTrack}
                      avatarName={participant.name}
                      avatarSrc={participant.avatarSrc}
                    />
                  ))
                ) : (
                  <TrackTile
                    label={tSession("meeting.waitingForParticipant")}
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-4">
                <Button
                  variant={micOn ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleMic}
                  disabled={controlsDisabled}
                  className="gap-2"
                >
                  {micOn ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                  {micOn
                    ? tSession("meeting.micOn")
                    : tSession("meeting.micOff")}
                </Button>

                <Button
                  variant={camOn ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleCam}
                  disabled={controlsDisabled}
                  className="gap-2"
                >
                  {camOn ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                  {camOn
                    ? tSession("meeting.camOn")
                    : tSession("meeting.camOff")}
                </Button>

                {canExtendMeeting && (
                  <ExtendMeetingDialog
                    disabled={controlsDisabled}
                    onConfirm={onExtendMeeting}
                    tSession={tSession}
                  />
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsLeaveDialogOpen(true)}
                  className="gap-2"
                >
                  <PhoneOff className="h-4 w-4" />
                  {tSession("meeting.leave")}
                </Button>
              </div>

              {joined && (
                <p className="text-center text-xs text-muted-foreground">
                  {tSession("meeting.autoRecordingNotice")}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="flex h-[500px] flex-col lg:h-[calc(100vh-8rem)] lg:sticky lg:top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {tSession("meeting.chat")}
              </CardTitle>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 overflow-y-auto space-y-3 pb-2">
              {chatMessages.length === 0 ? (
                <p className="pt-8 text-center text-sm text-muted-foreground">
                  {tSession("meeting.chatEmpty")}
                </p>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col gap-0.5",
                      msg.isOwn ? "items-end" : "items-start",
                    )}
                  >
                    <p className="px-1 text-xs text-muted-foreground">
                      {msg.senderName}
                    </p>
                    <div
                      className={cn(
                        "max-w-[85%] wrap-break-word rounded-2xl px-3 py-2 text-sm",
                        msg.isOwn
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm bg-muted",
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </CardContent>

            <CardFooter className="border-t pt-3">
              <form onSubmit={handleSend} className="flex w-full gap-2">
                <Input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder={tSession("meeting.messagePlaceholder")}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
