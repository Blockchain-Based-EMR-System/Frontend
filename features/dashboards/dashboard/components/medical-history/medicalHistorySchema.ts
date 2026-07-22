import { z } from "zod";
import {
  MEDICAL_HISTORY_CATEGORIES,
  MedicalHistoryCategory,
} from "../../types/medicalHistory.types";
import { DEFAULT_MAX_IMAGE_COUNT } from "@/lib/imageUtils";

export interface MedicalHistoryFormValues {
  category: MedicalHistoryCategory;
  title: string;
  description: string;
  date: Date;
  notes?: string;
  images: string[];
}

export const createMedicalHistorySchema = (
  tMedicalHistory: (key: string) => string,
) => {
  return z.object({
    category: z.enum(MEDICAL_HISTORY_CATEGORIES, {
      message: tMedicalHistory("validation.categoryRequired"),
    }),
    title: z
      .string()
      .trim()
      .min(1, { message: tMedicalHistory("validation.titleRequired") }),
    description: z
      .string()
      .trim()
      .min(1, { message: tMedicalHistory("validation.descriptionRequired") })
      .max(500, {
        message: tMedicalHistory("validation.descriptionTooLong"),
      }),
    date: z.date({
      message: tMedicalHistory("validation.dateRequired"),
    }),
    notes: z.string().trim().optional(),
    images: z.array(z.string()).max(DEFAULT_MAX_IMAGE_COUNT, {
      message: tMedicalHistory("validation.tooManyImages"),
    }),
  });
};
