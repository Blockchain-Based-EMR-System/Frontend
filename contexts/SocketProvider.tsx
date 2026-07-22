"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socketClient";
import { useUserStore } from "@/stores/useUserStore";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state.user);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    const socket = getSocket();

    const onConnect = () => {
      console.log("Socket connected: true");
      setIsConnected(true);
    };
    const onDisconnect = () => setIsConnected(false);
    const onConnectError = (err: Error) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    if (socket.connected) {
      setIsConnected(true);
    }

    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
      setIsConnected(false);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [user?.email, _hasHydrated]);

  return (
    <SocketContext.Provider
      value={{ socket: user ? getSocket() : null, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}
