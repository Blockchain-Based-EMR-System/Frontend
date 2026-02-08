import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export const convertDayResponseToNormalFormat = (day: string): string => {
  const dayMap: Record<string, string> = {
    SATURDAY: "saturday",
    SUNDAY: "sunday",
    MONDAY: "monday",
    TUESDAY: "tuesday",
    WEDNESDAY: "wednesday",
    THURSDAY: "thursday",
    FRIDAY: "friday",
  };
  return dayMap[day] || day;
};

export const formatDate = (dateStr: string, locale: string) => {
  try {
    const date = parseISO(dateStr);
    return format(date, locale === "ar" ? "d MMMM yyyy" : "MMMM d, yyyy", {
      locale: locale === "ar" ? ar : undefined,
    });
  } catch {
    return dateStr;
  }
};

// Sort days of the week in proper order (Sunday -> Saturday)
export const sortDays = (days: string[]): string[] => {
  const dayOrder: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };

  return [...days].sort((a, b) => {
    const orderA = dayOrder[a.toUpperCase()] ?? 999;
    const orderB = dayOrder[b.toUpperCase()] ?? 999;
    return orderA - orderB;
  });
};
