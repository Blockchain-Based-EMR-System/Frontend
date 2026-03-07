"use client";

import { useEffect } from "react";
import { useSocket } from "@/contexts/SocketProvider";

export function useSocketEvent<T>(
  event: string,
  handler: (data: T) => void,
): void {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
