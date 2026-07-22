import * as z from "zod";

export const createVerifyPasswordSchema = (t: (key: string) => string) => {
  return z.object({
    currentPassword: z.string().min(1, { message: t("passwordRequired") }),
  });
};

export const createChangePasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, { message: t("passwordRequired") })
        .min(8, { message: t("passwordMinLength") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("confirmPasswordRequired") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });
};
