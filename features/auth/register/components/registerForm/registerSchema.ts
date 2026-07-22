import * as z from "zod";

export const createRegisterSchema = (t: (key: string) => string) => {
  return z
    .object({
      fullName: z.string().min(2, { message: t("fullNameRequired") }),
      email: z.string().email({ message: t("invalidEmail") }),
      phoneNumber: z
        .string()
        .length(11, { message: t("phoneNumberMustBe11Digits") })
        .regex(/^(010|011|012|015)\d{8}$/, {
          message: t("invalidPhoneNumberFormat"),
        }),
      password: z.string().min(8, { message: t("passwordTooShort") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("confirmPasswordRequired") }),
      rememberMe: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
};
