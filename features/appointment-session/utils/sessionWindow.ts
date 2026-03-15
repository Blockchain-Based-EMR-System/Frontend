import { SessionGateState } from "../types/session.types";

const ONE_MINUTE_IN_SECONDS = 60;

const DATE_TIME_PARTS_REGEX = /^(\d{4}-\d{2}-\d{2})[T\s](.+)$/;
const TWELVE_HOUR_TIME_REGEX =
  /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])$/;
const TWENTY_FOUR_HOUR_TIME_REGEX = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

const normalizeTimeTo24Hour = (timeValue: string): string | null => {
  const value = timeValue.trim();

  const twelveHourMatch = value.match(TWELVE_HOUR_TIME_REGEX);
  if (twelveHourMatch) {
    const [, hourPart, minutePart, secondPart, period] = twelveHourMatch;
    let hour = Number.parseInt(hourPart, 10);
    if (Number.isNaN(hour)) return null;

    const normalizedPeriod = period.toUpperCase();
    if (normalizedPeriod === "PM" && hour < 12) hour += 12;
    if (normalizedPeriod === "AM" && hour === 12) hour = 0;

    const seconds = secondPart ?? "00";
    return `${hour.toString().padStart(2, "0")}:${minutePart}:${seconds}`;
  }

  const twentyFourHourMatch = value.match(TWENTY_FOUR_HOUR_TIME_REGEX);
  if (twentyFourHourMatch) {
    const [, hourPart, minutePart, secondPart] = twentyFourHourMatch;
    const hour = Number.parseInt(hourPart, 10);
    if (Number.isNaN(hour) || hour > 23) return null;
    const seconds = secondPart ?? "00";
    return `${hour.toString().padStart(2, "0")}:${minutePart}:${seconds}`;
  }

  return null;
};

export const parseAppointmentStart = (
  datePartOrIso: string,
  optionalTimePart?: string,
): Date | null => {
  const rawValue = datePartOrIso?.trim();
  if (!rawValue) return null;

  const parsedFromNative = new Date(rawValue);
  if (!Number.isNaN(parsedFromNative.getTime()) && !optionalTimePart) {
    return parsedFromNative;
  }

  if (optionalTimePart) {
    const normalizedTime = normalizeTimeTo24Hour(optionalTimePart);
    if (!normalizedTime) return null;

    const parsed = new Date(`${rawValue}T${normalizedTime}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const dateTimeParts = rawValue.match(DATE_TIME_PARTS_REGEX);
  if (!dateTimeParts) {
    return null;
  }

  const [, datePart, timePart] = dateTimeParts;
  const normalizedTime = normalizeTimeTo24Hour(timePart);
  if (!normalizedTime) return null;

  const parsed = new Date(`${datePart}T${normalizedTime}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getSessionGateState = (
  startAt: Date,
  now = new Date(),
  leadMinutes = 10,
): SessionGateState => {
  const openAtMs =
    startAt.getTime() - leadMinutes * ONE_MINUTE_IN_SECONDS * 1000;
  const nowMs = now.getTime();

  const secondsUntilEnabled = Math.max(
    0,
    Math.floor((openAtMs - nowMs) / 1000),
  );
  const secondsUntilStart = Math.max(
    0,
    Math.floor((startAt.getTime() - nowMs) / 1000),
  );

  return {
    canJoin: nowMs >= openAtMs,
    isTooEarly: nowMs < openAtMs,
    hasStarted: nowMs >= startAt.getTime(),
    secondsUntilEnabled,
    secondsUntilStart,
  };
};

export const formatCountdown = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};
