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