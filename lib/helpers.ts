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

export const getTimeIn12HourFormat = (time: string, locale?: string): string => {
  if (!time || time === "undefined:undefined") return "";
  if (locale === "ar") {
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "م" : "ص";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
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