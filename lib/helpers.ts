import { BaseResponse } from "@/types/common";

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

export const getTimeIn12HourFormat = (time: string): string => {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}