import * as z from "zod";

export const createLoginSchema = (t: (key: string) => string) => {
  return z.object({
    emailOrUsername: z.string().min(1, { message: t("emailRequired") }),
    password: z.string(),
    rememberMe: z.boolean().optional().default(false),
  });
};
