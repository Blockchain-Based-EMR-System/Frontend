"use client";

import { ArrowLeft, Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react";
import { OnlineLobbyPresentationalProps } from "./OnlineLobbyContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export function OnlineLobbyPresentational({
  canJoin,
  isTooEarly,
  countdown,
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
  showPreviewAvatar,
  micLevel,
  isMicDetecting,
  hasCamera,
  hasMicrophone,
  previewRef,
  onJoin,
  onBack,
  tSession,
  tCommon,
}: OnlineLobbyPresentationalProps) {
  const safeMicLevel = Math.max(0, Math.min(100, micLevel));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {tSession("backToAppointments")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{tSession("lobby.title")}</CardTitle>
          <CardDescription>{tSession("lobby.description")}</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
              <video
                ref={previewRef}
                muted
                autoPlay
                playsInline
                className={cn(
                  "h-full w-full object-cover",
                  showPreviewAvatar && "hidden",
                )}
              />
              {showPreviewAvatar && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl font-semibold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{displayName}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={micOn ? "default" : "outline"}
                onClick={() => setMicOn(!micOn)}
                className="gap-2"
              >
                {micOn ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
                {micOn ? tSession("lobby.micOn") : tSession("lobby.micOff")}
              </Button>
              <Button
                variant={camOn ? "default" : "outline"}
                onClick={() => setCamOn(!camOn)}
                className="gap-2"
              >
                {camOn ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
                {camOn ? tSession("lobby.camOn") : tSession("lobby.camOff")}
              </Button>
            </div>

            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Volume2 className="h-4 w-4 text-primary" />
                  {tSession("lobby.micLevel")}
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted-foreground/20">
                <div
                  className={cn(
                    "h-full transition-all duration-150",
                    isMicDetecting ? "bg-emerald-500" : "bg-amber-500",
                  )}
                  style={{ width: `${Math.max(4, safeMicLevel)}%` }}
                />
              </div>
              {!hasMicrophone && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {tSession("lobby.noMicrophoneDevices")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{tSession("lobby.microphone")}</Label>
              <Select
                value={selectedMicrophone}
                onValueChange={setSelectedMicrophone}
                disabled={isLoadingDevices || !hasMicrophone}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={tSession("lobby.selectMicrophone")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {microphones.map((mic) => (
                    <SelectItem key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || tSession("offline.unnamedMicrophone")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{tSession("lobby.camera")}</Label>
              <Select
                value={selectedCamera}
                onValueChange={setSelectedCamera}
                disabled={isLoadingDevices || !hasCamera}
              >
                <SelectTrigger>
                  <SelectValue placeholder={tSession("lobby.selectCamera")} />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((cam) => (
                    <SelectItem key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || tSession("lobby.unnamedCamera")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!hasCamera && (
              <p className="text-xs text-muted-foreground">
                {tSession("lobby.noCameraDevices")}
              </p>
            )}

            {isTooEarly && (
              <p className="text-sm text-muted-foreground">
                {tSession("meeting.availableIn", { time: countdown })}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onBack}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={onJoin} disabled={!canJoin}>
            {tSession("meeting.join")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
