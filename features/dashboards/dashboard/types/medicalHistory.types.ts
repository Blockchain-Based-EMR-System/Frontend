import { ApiResponse } from "@/types";

export const MEDICAL_HISTORY_CATEGORIES = ["LAB", "SCAN", "GENERAL"] as const;

export type MedicalHistoryCategory =
  (typeof MEDICAL_HISTORY_CATEGORIES)[number];

export interface MedicalHistoryContent {
  category: MedicalHistoryCategory;
  title: string;
  description: string;
  date: string;
  notes?: string;
  images?: string[];
}

export interface MedicalHistoryRecord {
  recordId: string;
  name: string;
  content: MedicalHistoryContent;
}

export interface MedicalHistoryRawRecord {
  recordId: string;
  name?: string;
  content?: unknown;
}

export interface UpsertMedicalHistoryRequest {
  name: string;
  content: MedicalHistoryContent;
}

export type PatientMedicalHistoryListResponse = ApiResponse<
  MedicalHistoryRawRecord[]
>;

export type CreateMedicalHistoryResponse = ApiResponse<{
  recordId: string;
}>;

export type UpdateMedicalHistoryResponse = ApiResponse<null>;

export type DeleteMedicalHistoryResponse = ApiResponse<null>;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function normalizeCategory(value: unknown): MedicalHistoryCategory {
  if (
    typeof value === "string" &&
    MEDICAL_HISTORY_CATEGORIES.includes(
      value.toUpperCase() as MedicalHistoryCategory,
    )
  ) {
    return value.toUpperCase() as MedicalHistoryCategory;
  }

  return "GENERAL";
}

function normalizeImages(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const imageList = value.filter(
    (entry): entry is string =>
      typeof entry === "string" && entry.startsWith("data:image/"),
  );

  return imageList.length > 0 ? imageList : undefined;
}

export function buildMedicalHistoryName(
  category: MedicalHistoryCategory,
): string {
  return `MedicalHistory-${category}`;
}

export function normalizeMedicalHistoryContent(
  content: unknown,
): MedicalHistoryContent | null {
  if (!isObject(content)) {
    return null;
  }

  const title = asString(content.title);
  const description = asString(content.description);
  const date = asString(content.date);

  if (!title || !description || !date) {
    return null;
  }

  const notes = asString(content.notes);

  return {
    category: normalizeCategory(content.category),
    title,
    description,
    date,
    ...(notes ? { notes } : {}),
    ...(normalizeImages(content.images)
      ? { images: normalizeImages(content.images) }
      : {}),
  };
}

export function mapMedicalHistoryRecord(
  rawRecord: MedicalHistoryRawRecord,
): MedicalHistoryRecord | null {
  if (!rawRecord.recordId) {
    return null;
  }

  const normalizedContent = normalizeMedicalHistoryContent(rawRecord.content);
  if (!normalizedContent) {
    return null;
  }

  return {
    recordId: rawRecord.recordId,
    name: rawRecord.name || buildMedicalHistoryName(normalizedContent.category),
    content: normalizedContent,
  };
}
