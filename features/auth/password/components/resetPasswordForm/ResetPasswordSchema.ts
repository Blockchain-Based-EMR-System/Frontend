import { z } from "zod";

export const createResetPasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, t("passwordRequired"))
        .min(8, t("passwordTooShort"))
        .max(32, t("passwordTooLong")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
};

export type ResetPasswordFormData = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
