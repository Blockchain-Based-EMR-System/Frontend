import * as z from "zod";

export const createUpdateProfileSchema = (
  t: (key: string) => string,
  isDoctor: boolean,
) => {
  const baseSchema = {
    name: z
      .string()
      .min(1, { message: t("fullNameRequired") })
      .min(2, { message: t("nameMinLength") })
      .trim(),
    phone: z
      .string()
      .min(1, { message: t("phoneNumberRequired") })
      .length(11, { message: t("phoneNumberMustBe11Digits") })
      .regex(/^(010|011|012|015)\d{8}$/, {
        message: t("invalidPhoneNumberFormat"),
      }),
    gender: z.enum(["MALE", "FEMALE"], {
      message: t("genderRequired"),
    }),
    dateOfBirth: z.date({
      message: t("dateOfBirthRequired"),
    }),
  };

  if (isDoctor) {
    return z.object({
      ...baseSchema,
      availability_type: z.enum(["ONLINE", "OFFLINE", "BOTH"], {
        message: t("availabilityTypeRequired"),
      }),
    });
  }

  return z.object(baseSchema);
};
