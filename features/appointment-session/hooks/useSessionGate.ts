"use client";

import { useEffect, useMemo, useState } from "react";
import { getSessionGateState } from "../utils/sessionWindow";

export const useSessionGate = (
  startAt: Date | null,
  leadMinutes = 10,
  autoTick = true,
) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!autoTick) return;

    const id = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(id);
  }, [autoTick]);

  return useMemo(() => {
    if (!startAt) {
      return {
        canJoin: false,
        isTooEarly: true,
        hasStarted: false,
        secondsUntilEnabled: 0,
        secondsUntilStart: 0,
      };
    }

    return getSessionGateState(startAt, now, leadMinutes);
  }, [leadMinutes, now, startAt]);
};
