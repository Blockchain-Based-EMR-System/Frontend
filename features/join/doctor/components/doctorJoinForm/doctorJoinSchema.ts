import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_FILE_TYPE = "application/pdf";

const fileSchema = (t: (key: string) => string) =>
  z
    .instanceof(File, { message: t("validation.fileRequired") })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: t("validation.fileTooLarge"),
    })
    .refine((file) => file.type === ACCEPTED_FILE_TYPE, {
      message: t("validation.onlyPDFAllowed"),
    });

export const createStep1Schema = (t: (key: string) => string) => {
  return z
    .object({
      fullName: z
        .string()
        .min(2, { message: t("validation.fullNameRequired") }),
      email: z.string().email({ message: t("validation.invalidEmail") }),
      phoneNumber: z
        .string()
        .length(11, { message: t("validation.phoneNumberMustBe11Digits") })
        .regex(/^(010|011|012|015)\d{8}$/, {
          message: t("validation.invalidPhoneNumberFormat"),
        }),
      password: z
        .string()
        .min(8, { message: t("validation.passwordTooShort") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("validation.confirmPasswordRequired") }),
      gender: z.enum(["MALE", "FEMALE"], {
        message: t("validation.genderRequired"),
      }),
      dateOfBirth: z.date({
        message: t("validation.dateOfBirthRequired"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });
};

export const createStep2Schema = (t: (key: string) => string) => {
  return z.object({
    graduationCertificate: fileSchema(t),
    membershipCard: fileSchema(t),
    professionalPracticeCard: fileSchema(t),
  });
};

export const createStep3Schema = (t: (key: string) => string) => {
  return z.object({
    mastersCertificate: fileSchema(t),
    fellowshipCertificate: fileSchema(t),
    unionSpecializationCertificate: fileSchema(t),
  });
};

export const createDoctorJoinSchema = (t: (key: string) => string) => {
  return z
    .object({
      fullName: z
        .string()
        .min(2, { message: t("validation.fullNameRequired") }),
      email: z.string().email({ message: t("validation.invalidEmail") }),
      phoneNumber: z
        .string()
        .length(11, { message: t("validation.phoneNumberMustBe11Digits") })
        .regex(/^(010|011|012|015)\d{8}$/, {
          message: t("validation.invalidPhoneNumberFormat"),
        }),
      password: z
        .string()
        .min(8, { message: t("validation.passwordTooShort") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("validation.confirmPasswordRequired") }),
      gender: z.enum(["MALE", "FEMALE"], {
        message: t("validation.genderRequired"),
      }),
      dateOfBirth: z.date({
        message: t("validation.dateOfBirthRequired"),
      }),
      graduationCertificate: fileSchema(t),
      membershipCard: fileSchema(t),
      professionalPracticeCard: fileSchema(t),
      mastersCertificate: fileSchema(t),
      fellowshipCertificate: fileSchema(t),
      unionSpecializationCertificate: fileSchema(t),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });
};
