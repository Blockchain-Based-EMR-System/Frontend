import z from "zod";

export const createAddAdminSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("invalidEmail")),
    name: z.string().min(2, t("nameMinLength")),
    password: z.string().min(6, t("passwordMinLength")),
    phone: z
      .string()
      .min(10, t("phoneMinLength"))
      .length(11, t("phoneNumberMustBe11Digits"))
      .regex(/^(010|011|012|015)\d{8}$/, t("invalidPhoneNumberFormat")),
    gender: z.enum(["MALE", "FEMALE"], {
      message: t("genderRequired"),
    }),
    date_of_birth: z.string().min(1, t("dateOfBirthRequired")),
  });
};

export type AddAdminFormData = z.infer<ReturnType<typeof createAddAdminSchema>>;
