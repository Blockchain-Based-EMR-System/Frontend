import { z } from "zod";

export const createCompleteProfileSchema = (
  t: (key: string) => string,
  requirePhone: boolean = false
) => {
  const baseSchema = {
    gender: z.enum(["MALE", "FEMALE"], {
      message: t("genderRequired"),
    }),
    date_of_birth: z.string().min(1, t("dateOfBirthRequired")),
  };

  if (requirePhone) {
    return z.object({
      phone: z
        .string()
        .min(1, t("phoneNumberRequired"))
        .length(11, t("phoneNumberMustBe11Digits"))
        .regex(/^(010|011|012|015)\d{8}$/, t("invalidPhoneNumberFormat")),
      ...baseSchema,
    });
  }

  return z.object(baseSchema);
};

export type CompleteProfileFormData = z.infer<
  ReturnType<typeof createCompleteProfileSchema>
>;
