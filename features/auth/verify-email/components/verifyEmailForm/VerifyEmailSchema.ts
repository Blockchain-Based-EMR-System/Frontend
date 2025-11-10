import { z } from "zod";

export const createVerifyEmailSchema = (t: (key: string) => string) => {
  return z.object({
    otp: z
      .string()
      .min(1, t("otpRequired"))
      .length(6, t("otpMustBe6Digits"))
      .regex(/^\d+$/, t("otpMustBeNumeric")),
  });
};

export type VerifyEmailFormData = z.infer<
  ReturnType<typeof createVerifyEmailSchema>
>;
