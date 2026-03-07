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

export const getTimeIn12HourFormat = (time: string, locale?: string, addHours?: number): string => {
  if (!time || time === "undefined:undefined") return "";
  
  const [hourStr, minute] = time.split(":");
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