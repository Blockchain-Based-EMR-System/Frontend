import * as z from "zod";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const isTimeBefore = (time1: string, time2: string): boolean => {
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);
  return hours1 < hours2 || (hours1 === hours2 && minutes1 < minutes2);
};

export const createClinicSchema = (t: (key: string) => string) => {
  return z
    .object({
      name: z
        .string()
        .min(2, { message: t("clinicNameMinLength") })
        .max(100, { message: t("nameMinLength") }),
      address: z
        .string()
        .min(5, { message: t("addressMinLength") })
        .max(255),
      address_maps_link: z
        .string()
        .url({ message: t("invalidUrl") })
        .optional()
        .or(z.literal("")),
      phone: z
        .string()
        .min(10, { message: t("phoneMinLength") })
        .regex(/^[\d\s\-\+\(\)]+$/, { message: t("invalidPhoneNumber") }),
      opening_at: z
        .string()
        .regex(timeRegex, { message: t("invalidTimeFormat") }),
      closing_at: z
        .string()
        .regex(timeRegex, { message: t("invalidTimeFormat") }),
      fees: z
        .number()
        .min(0, { message: t("feesMinValue") })
        .max(1000000),
      canPayOnline: z.boolean(),
    })
    .refine((data) => isTimeBefore(data.opening_at, data.closing_at), {
      message: t("closingMustBeAfterOpening"),
      path: ["closing_at"],
    });
};

export type ClinicFormData = z.infer<ReturnType<typeof createClinicSchema>>;
