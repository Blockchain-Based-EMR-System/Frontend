import * as z from "zod";
import { DayOfWeek, AppointmentType } from "../../types/schedule.types";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const isTimeBefore = (time1: string, time2: string): boolean => {
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);
  return hours1 < hours2 || (hours1 === hours2 && minutes1 < minutes2);
};

const intervalsOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => {
  return !isTimeBefore(end1, start2) && !isTimeBefore(end2, start1);
};

const timeIntervalSchema = (t: (key: string) => string) =>
  z.object({
    start: z.string().regex(timeRegex, { message: t("invalidTimeFormat") }),
    end: z.string().regex(timeRegex, { message: t("invalidTimeFormat") }),
  });

export const createDayConfigSchema = (
  t: (key: string) => string,
  clinicOpeningTime?: string,
  clinicClosingTime?: string,
) => {
  return z
    .object({
      day: z.number().min(0).max(6) as z.ZodType<DayOfWeek>,
      isActive: z.boolean(),
      slotDuration: z
        .number()
        .min(5, { message: t("slotDurationMinValue") })
        .max(120, { message: t("slotDurationMaxValue") }),
      bufferTime: z
        .number()
        .min(0, { message: t("bufferTimeMinValue") })
        .max(60, { message: t("bufferTimeMaxValue") }),
      appointmentType: z.enum([
        "offline",
        "online",
        "both",
      ]) as z.ZodType<AppointmentType>,
      offlineInterval: timeIntervalSchema(t).optional(),
      onlineInterval: timeIntervalSchema(t).optional(),
    })
    .refine(
      (data) => {
        if (!data.isActive || data.appointmentType === "online") return true;
        return !!data.offlineInterval;
      },
      {
        message: t("intervalStartRequired"),
        path: ["offlineInterval"],
      },
    )
    .refine(
      (data) => {
        if (!data.isActive || data.appointmentType === "offline") return true;
        return !!data.onlineInterval;
      },
      {
        message: t("intervalStartRequired"),
        path: ["onlineInterval"],
      },
    )
    .refine(
      (data) => {
        if (!data.isActive || !data.offlineInterval) return true;
        return isTimeBefore(
          data.offlineInterval.start,
          data.offlineInterval.end,
        );
      },
      {
        message: t("intervalEndMustBeAfterStart"),
        path: ["offlineInterval", "end"],
      },
    )
    .refine(
      (data) => {
        if (!data.isActive || !data.onlineInterval) return true;
        return isTimeBefore(data.onlineInterval.start, data.onlineInterval.end);
      },
      {
        message: t("intervalEndMustBeAfterStart"),
        path: ["onlineInterval", "end"],
      },
    )
    .refine(
      (data) => {
        if (
          !data.isActive ||
          data.appointmentType !== "both" ||
          !data.offlineInterval ||
          !data.onlineInterval
        )
          return true;

        return !intervalsOverlap(
          data.offlineInterval.start,
          data.offlineInterval.end,
          data.onlineInterval.start,
          data.onlineInterval.end,
        );
      },
      {
        message: t("intervalsOverlap"),
        path: ["onlineInterval"],
      },
    )
    .refine(
      (data) => {
        if (
          !data.isActive ||
          !data.offlineInterval ||
          !clinicOpeningTime ||
          !clinicClosingTime ||
          data.appointmentType === "online"
        )
          return true;

        const withinStart = !isTimeBefore(
          data.offlineInterval.start,
          clinicOpeningTime,
        );
        const withinEnd = !isTimeBefore(
          clinicClosingTime,
          data.offlineInterval.end,
        );

        return withinStart && withinEnd;
      },
      {
        message: t("intervalOutsideWorkingHours"),
        path: ["offlineInterval"],
      },
    );
};

export const createScheduleFormSchema = (t: (key: string) => string) => {
  return z.object({
    clinicId: z.string().nullable(),
    days: z.array(createDayConfigSchema(t)),
  });
};

export type DayConfigFormData = z.infer<
  ReturnType<typeof createDayConfigSchema>
>;
export type ScheduleFormData = z.infer<
  ReturnType<typeof createScheduleFormSchema>
>;
