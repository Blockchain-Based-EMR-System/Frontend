import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPE = "application/pdf";

const fileSchema = (t: (key: string) => string) =>
  z
    .instanceof(File, { message: t("fileRequired") })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: t("fileTooLarge"),
    })
    .refine((file) => file.type === ACCEPTED_FILE_TYPE, {
      message: t("onlyPDFAllowed"),
    });

const optionalFileSchema = (t: (key: string) => string) =>
  z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: t("fileTooLarge"),
    })
    .refine((file) => file.type === ACCEPTED_FILE_TYPE, {
      message: t("onlyPDFAllowed"),
    })
    .optional();

export const createStep1Schema = (t: (key: string) => string) => {
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
      gender: z.enum(["MALE", "FEMALE"], {
        message: t("genderRequired"),
      }),
      dateOfBirth: z.date({
        message: t("dateOfBirthRequired"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
};

export const createStep2Schema = (
  t: (key: string) => string,
  tNurse: (key: string) => string,
) => {
  return z.object({
    yearsOfExperience: z
      .number({ message: tNurse("yearsOfExperienceRequired") })
      .min(0, { message: tNurse("yearsOfExperienceMin") })
      .max(50, { message: tNurse("yearsOfExperienceMax") }),
    brief: z.string().optional(),
    nationalCard: fileSchema(t),
    bonusFile: optionalFileSchema(t),
  });
};

export const createNurseJoinSchema = (
  t: (key: string) => string,
  tNurse: (key: string) => string,
) => {
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
      gender: z.enum(["MALE", "FEMALE"], {
        message: t("genderRequired"),
      }),
      dateOfBirth: z.date({
        message: t("dateOfBirthRequired"),
      }),
      yearsOfExperience: z
        .number({ message: tNurse("yearsOfExperienceRequired") })
        .min(0, { message: tNurse("yearsOfExperienceMin") })
        .max(50, { message: tNurse("yearsOfExperienceMax") }),
      brief: z.string().optional(),
      nationalCard: fileSchema(t),
      bonusFile: optionalFileSchema(t),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
};
