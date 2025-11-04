import * as z from "zod";

export const createRegisterSchema = (t: (key: string) => string) => {
  return z
    .object({
      fullName: z.string().min(2, { message: t("fullNameRequired") }),
      email: z.string().email({ message: t("invalidEmail") }),
      phoneNumber: z
        .string()
        .min(10, { message: t("phoneNumberTooShort") })
        .regex(/^[0-9+\-\s()]*$/, { message: t("invalidPhoneNumber") }),
      password: z.string().min(8, { message: t("passwordTooShort") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
};
