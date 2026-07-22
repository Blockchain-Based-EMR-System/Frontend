import { z } from "zod";

export const createForgotPasswordSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("invalidEmail")),
  });
};

export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
