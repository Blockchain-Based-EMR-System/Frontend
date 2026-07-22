"use client";

import { useEffect, useRef } from "react";
import type { ILocalVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers";

interface TrackTileProps {
  label: string;
  track?: ILocalVideoTrack | IRemoteVideoTrack | null;
  className?: string;
  showAvatar?: boolean;
  avatarName?: string;
  avatarSrc?: string | null;
}

export function TrackTile({
  label,
  track,
  className,
  showAvatar,
  avatarName,
  avatarSrc,
}: TrackTileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !track) return;

    track.play(containerRef.current);

    return () => {
      track.stop();
    };
  }, [track]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted",
        className,
      )}
    >
      <div ref={containerRef} className="aspect-video w-full" />
      {showAvatar && avatarName && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarSrc ?? undefined} alt={avatarName} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(avatarName)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium text-muted-foreground">
            {avatarName}
          </p>
        </div>
      )}

      {!showAvatar && !track && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
          {label}
        </div>
      )}
      <p className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium">
        {label}
      </p>
    </div>
  );
}
