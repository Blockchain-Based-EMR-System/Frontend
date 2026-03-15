"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  Send,
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

export function OnlineRoomPresentational({
  isJoining,
  joined,
  isRecording,
  recordingLabel,
  localVideoTrack,
  remoteParticipants,
  micOn,
  camOn,
  displayName,
  chatMessages,
  controlsDisabled,
  onToggleMic,
  onToggleCam,
  onSendMessage,
  onLeave,
  tSession,
}: OnlineRoomPresentationalProps) {
  const [messageText, setMessageText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onSendMessage(messageText);
    setMessageText("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle>{tSession("meeting.roomTitle")}</CardTitle>
            <Badge
              variant={isRecording ? "destructive" : "secondary"}
              className="gap-1"
            >
              <Radio className="h-3.5 w-3.5" />
              {isRecording
                ? `${tSession("recording.live")} ${recordingLabel}`
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
                avatarName={displayName}
                className="border-primary/30"
              />

              {remoteParticipants.length > 0 ? (
                remoteParticipants.map((participant) => (
                  <TrackTile
                    key={participant.id}
                    label={participant.name}
                    track={participant.videoTrack || null}
                  />
                ))
              ) : (
                <TrackTile label={tSession("meeting.waitingForParticipant")} />
              )}
            </div>

            <div className="flex items-center justify-center gap-3 border-t pt-4">
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
                {micOn ? tSession("meeting.micOn") : tSession("meeting.micOff")}
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
                {camOn ? tSession("meeting.camOn") : tSession("meeting.camOff")}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => void onLeave()}
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
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={tSession("meeting.messagePlaceholder")}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!messageText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
