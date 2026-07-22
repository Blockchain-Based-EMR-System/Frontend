"use client";

import { Mic, Timer, Loader2, ArrowLeft } from "lucide-react";
import { OfflineSessionPresentationalProps } from "./OfflineSessionContainer";
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
import { Badge } from "@/components/ui/badge";

export function OfflineSessionPresentational({
  canStart,
  isTooEarly,
  countdown,
  microphones,
  selectedMicrophone,
  onMicrophoneChange,
  isLoadingDevices,
  isRecording,
  elapsedLabel,
  isBusy,
  status,
  onStartRecording,
  onStopRecording,
  onBack,
  tSession,
  tCommon,
}: OfflineSessionPresentationalProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {tSession("backToAppointments")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{tSession("offline.title")}</CardTitle>
          <CardDescription>{tSession("offline.description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {tSession("offline.chooseMicrophone")}
            </p>
            <Select
              value={selectedMicrophone}
              onValueChange={onMicrophoneChange}
              disabled={isLoadingDevices || isRecording || isBusy}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingDevices
                      ? tSession("offline.loadingDevices")
                      : tSession("offline.microphonePlaceholder")
                  }
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

          <div className="rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">
                  {tSession("recording.status")}
                </p>
                <Badge variant={isRecording ? "destructive" : "secondary"}>
                  {isRecording
                    ? tSession("recording.live")
                    : tSession(`status.${status}`)}
                </Badge>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <Timer className="h-4 w-4" />
                  {elapsedLabel}
                </div>
              )}
            </div>
          </div>

          {isTooEarly && !isRecording && (
            <p className="text-sm text-muted-foreground">
              {tSession("meeting.availableIn", { time: countdown })}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex gap-3">
          {!isRecording ? (
            <Button
              onClick={() => void onStartRecording()}
              disabled={
                !canStart || isBusy || isLoadingDevices || !selectedMicrophone
              }
              className="gap-2"
            >
              {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
              <Mic className="h-4 w-4" />
              {tSession("recording.start")}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => void onStopRecording()}
              disabled={isBusy}
              className="gap-2"
            >
              {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
              {tSession("recording.stopAndUpload")}
            </Button>
          )}

          <Button variant="outline" onClick={onBack} disabled={isBusy}>
            {tCommon("cancel")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
