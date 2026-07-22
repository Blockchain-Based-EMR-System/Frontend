import { BaseResponse } from "@/types/common";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { Locale } from "date-fns";

export const getLocalizedMessage = (
  response: BaseResponse | undefined | null,
  locale: "en" | "ar",
): string => {
  if (!response) {
    return "Operation completed";
  }

  if (locale === "ar" && response.messageAr) {
    return response.messageAr;
  }
  if (locale === "en" && response.messageEn) {
    return response.messageEn;
  }
  return (
    response.message ||
    response.messageEn ||
    response.messageAr ||
    "Operation completed"
  );
};

export const getTimeIn12HourFormat = (
  time: string,
  locale?: string,
  addHours?: number,
): string => {
  if (!time || time === "undefined:undefined") return "";

  const timePart = time.includes("T") ? time.split("T")[1] : time;

  const [hourStr, minute] = timePart.split(":");
  let hour = (parseInt(hourStr, 10) + (addHours ?? 0)) % 24;
  const isPM = hour >= 12;
  hour = hour % 12 || 12;
  const hourDisplay = hour.toString().padStart(2, "0");

  if (locale === "ar") {
    return `${hourDisplay}:${minute} ${isPM ? "م" : "ص"}`;
  }

  return `${hourDisplay}:${minute} ${isPM ? "PM" : "AM"}`;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatTime = (dateString: string, locale?: string) => {
  if (!dateString || dateString.includes("undefined")) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const localeObj = locale === "ar" ? ar : undefined;
    return format(date, "h:mm a", { locale: localeObj as Locale });
  } catch {
    return "";
  }
};

export const formatDate = (dateString: string, locale?: string) => {
  if (!dateString || dateString.includes("undefined")) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const localeObj = locale === "ar" ? ar : undefined;
    return format(date, "EEEE, MMMM d, yyyy", { locale: localeObj as Locale });
  } catch {
    return "";
  }
};

/**
 * Builds a local datetime ISO string with timezone offset (e.g. "2026-06-28T22:25:00+03:00").
 * Use this when sending datetime strings to the backend to preserve the user's local time.
 * Without the offset, the backend may interpret the datetime as UTC.
 */
export const buildLocalISOString = (
  date: string,
  time: string,
): string => {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const minutes = String(absOffset % 60).padStart(2, "0");
  return `${date}T${time}:00${sign}${hours}:${minutes}`;
};

/**
 * Converts a UTC date and time to a local datetime ISO string.
 * The backend stores and returns times in UTC, so this function
 * converts them to the user's local timezone for correct display.
 * e.g. utcToLocalDateTime("2026-06-28", "19:25") → "2026-06-28T22:25:00" (in UTC+3)
 */
export const utcToLocalDateTime = (
  utcDate: string,
  utcTime: string,
): string => {
  const utc = new Date(`${utcDate}T${utcTime}:00Z`);
  const y = utc.getFullYear();
  const mo = String(utc.getMonth() + 1).padStart(2, "0");
  const d = String(utc.getDate()).padStart(2, "0");
  const h = String(utc.getHours()).padStart(2, "0");
  const mi = String(utc.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${d}T${h}:${mi}:00`;
};
